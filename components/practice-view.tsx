'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, BarChart3, Volume2, Mic, Loader2, Square, LogOut } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { FeedbackModal } from '@/components/feedback-modal';
import { ProgressModal } from '@/components/progress-modal';
import { SettingsModal } from '@/components/settings-modal';
import { useSpeechRecognition } from '@/lib/speech-recognition';
import { saveAttempt, getSettings, getCurrentPhrase, saveCurrentPhrase, clearCurrentPhrase } from '@/lib/storage';
import { getScoreColor } from '@/lib/scoring';
import {
  setWaterColorsByLanguage,
  setWaveSpeed,
  setWaveIntensity,
  setAnalyser as setWaterAnalyser,
  setDirectAudioLevel,
} from '@/lib/water-state';
import { t } from '@/lib/i18n';
import type {
  AppSettings,
  GeneratedPhrase,
  ConversationContext,
  ScoringResult,
  OrbState,
  ModalState,
  Language,
} from '@/types';

interface PracticeViewProps {
  settings: AppSettings;
  onEndSession: () => void;
}

const langMap: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
};

export function PracticeView({ settings: initialSettings, onEndSession }: PracticeViewProps) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [currentPhrase, setCurrentPhrase] = useState<GeneratedPhrase | null>(null);
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [modalState, setModalState] = useState<ModalState>('none');
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [isLoadingPhrase, setIsLoadingPhrase] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const [phraseCount, setPhraseCount] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const ttsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lang = settings.language;

  useEffect(() => {
    setWaterColorsByLanguage(settings.language);
  }, [settings.language]);

  useEffect(() => {
    switch (orbState) {
      case 'idle':
        setWaveSpeed(1.0);
        setWaveIntensity(1.0);
        break;
      case 'listening':
        setWaveSpeed(1.3);
        setWaveIntensity(1.3);
        break;
      case 'processing':
        setWaveSpeed(1.8);
        setWaveIntensity(0.8);
        break;
      case 'score':
        setWaveSpeed(0.6);
        setWaveIntensity(1.5);
        break;
    }
  }, [orbState]);

  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic: settings.topic,
    previousPhrases: [],
    weakAreas: [],
    lastScore: null,
  });

  const {
    transcript,
    startListening,
    stopListening,
    error: speechError,
    isSupported,
  } = useSpeechRecognition(settings.language);

  const generatePhrase = useCallback(async (ctx?: ConversationContext) => {
    const current = getSettings() || settings;
    setIsLoadingPhrase(true);
    setError(null);
    setOrbState('processing');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: current.language,
          level: current.level,
          topic: current.topic,
          conversationContext: ctx || conversationContext,
          apiKey: current.apiKey,
        }),
      });

      if (response.status === 401) {
        setError(t('practice.invalidApiKey', lang));
        setOrbState('idle');
        setIsLoadingPhrase(false);
        return;
      }

      if (!response.ok) throw new Error('Failed');

      const phrase: GeneratedPhrase = await response.json();
      setCurrentPhrase(phrase);
      saveCurrentPhrase(phrase);
      setPhraseCount((c) => c + 1);
      setOrbState('idle');
    } catch {
      setError(t('practice.failedGenerate', lang));
      setOrbState('idle');
    } finally {
      setIsLoadingPhrase(false);
    }
  }, [settings, conversationContext, lang]);

  useEffect(() => {
    const saved = getCurrentPhrase();
    if (saved) {
      setCurrentPhrase(saved);
      setPhraseCount(1);
      setOrbState('idle');
    } else {
      generatePhrase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTTSAudioSimulation = useCallback(() => {
    const start = Date.now();
    ttsIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) * 0.001;
      const level = 0.25 + Math.sin(elapsed * 4.0) * 0.1 + Math.sin(elapsed * 7.3) * 0.08 + Math.random() * 0.05;
      setDirectAudioLevel(Math.max(0, Math.min(1, level)));
    }, 30);
  }, []);

  const stopTTSAudioSimulation = useCallback(() => {
    if (ttsIntervalRef.current) {
      clearInterval(ttsIntervalRef.current);
      ttsIntervalRef.current = null;
    }
    setDirectAudioLevel(null);
  }, []);

  const playTTS = useCallback(async () => {
    if (!currentPhrase) return;
    setIsPlayingTTS(true);
    setError(null);
    startTTSAudioSimulation();

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentPhrase.phrase, language: settings.language }),
      });

      if (response.status === 501) {
        stopTTSAudioSimulation();
        if ('speechSynthesis' in window) {
          startTTSAudioSimulation();
          const utterance = new SpeechSynthesisUtterance(currentPhrase.phrase);
          utterance.lang = langMap[settings.language];
          utterance.rate = 0.85;
          utterance.onend = () => { setIsPlayingTTS(false); stopTTSAudioSimulation(); };
          utterance.onerror = () => { setIsPlayingTTS(false); stopTTSAudioSimulation(); };
          speechSynthesis.speak(utterance);
          return;
        }
        throw new Error('No TTS');
      }

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlayingTTS(false);
        stopTTSAudioSimulation();
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlayingTTS(false);
        stopTTSAudioSimulation();
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch {
      stopTTSAudioSimulation();
      if ('speechSynthesis' in window && currentPhrase) {
        startTTSAudioSimulation();
        const utterance = new SpeechSynthesisUtterance(currentPhrase.phrase);
        utterance.lang = langMap[settings.language];
        utterance.rate = 0.85;
        utterance.onend = () => { setIsPlayingTTS(false); stopTTSAudioSimulation(); };
        utterance.onerror = () => { setIsPlayingTTS(false); stopTTSAudioSimulation(); };
        speechSynthesis.speak(utterance);
      } else {
        setError(t('practice.couldNotPlay', lang));
        setIsPlayingTTS(false);
      }
    }
  }, [currentPhrase, settings.language, lang, startTTSAudioSimulation, stopTTSAudioSimulation]);

  const handleStartRecording = useCallback(async () => {
    setError(null);
    setScoringResult(null);
    setOrbState('listening');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      setWaterAnalyser(analyser);
    } catch {
      // Continue without audio visualization
    }

    startListening();
  }, [startListening]);

  const handleStopRecording = useCallback(async () => {
    stopListening();
    setOrbState('processing');
    setWaterAnalyser(null);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    await new Promise((r) => setTimeout(r, 500));
    const finalTranscript = transcript;
    setLastTranscript(finalTranscript);

    if (!finalTranscript.trim()) {
      setError(t('practice.noSpeech', lang));
      setOrbState('idle');
      return;
    }

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPhrase: currentPhrase?.phrase || '',
          userTranscription: finalTranscript,
          language: settings.language,
          level: settings.level,
          apiKey: settings.apiKey,
        }),
      });

      if (!response.ok) throw new Error('Scoring failed');

      const result: ScoringResult = await response.json();
      setScoringResult(result);
      setOrbState('score');

      saveAttempt({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        exerciseId: `gen-${Date.now()}`,
        language: settings.language,
        level: settings.level,
        targetPhrase: currentPhrase?.phrase || '',
        userTranscription: finalTranscript,
        score: result.score,
        timestamp: Date.now(),
      });

      const weakWords = result.wordAnalysis
        .filter((w) => w.score < 60)
        .map((w) => w.target);

      setConversationContext((prev) => ({
        ...prev,
        previousPhrases: [...prev.previousPhrases, currentPhrase?.phrase || ''].slice(-5),
        weakAreas: [...new Set([...prev.weakAreas, ...weakWords])].slice(-10),
        lastScore: result.score,
      }));

      setTimeout(() => {
        setModalState('feedback');
      }, 1500);
    } catch {
      setError(t('practice.failedFeedback', lang));
      setOrbState('idle');
    }
  }, [stopListening, transcript, currentPhrase, settings, lang]);

  const handleRetry = useCallback(() => {
    setModalState('none');
    setScoringResult(null);
    setOrbState('idle');
  }, []);

  const handleContinue = useCallback(() => {
    setModalState('none');
    setScoringResult(null);
    setCurrentPhrase(null);
    clearCurrentPhrase();
    generatePhrase();
  }, [generatePhrase]);

  const handleSettingsChanged = useCallback((changed: { language: boolean; level: boolean; topic: boolean }) => {
    const newSettings = getSettings();
    if (newSettings) {
      setSettings(newSettings);
      setWaterColorsByLanguage(newSettings.language);
      if (changed.language || changed.level || changed.topic) {
        setConversationContext({
          topic: newSettings.topic,
          previousPhrases: [],
          weakAreas: [],
          lastScore: null,
        });
        setCurrentPhrase(null);
        clearCurrentPhrase();
        setScoringResult(null);
        setOrbState('idle');
        setTimeout(() => {
          generatePhrase({
            topic: newSettings.topic,
            previousPhrases: [],
            weakAreas: [],
            lastScore: null,
          });
        }, 100);
      }
    }
  }, [generatePhrase]);

  const handleMicTap = useCallback(() => {
    if (orbState === 'idle' && currentPhrase) {
      handleStartRecording();
    } else if (orbState === 'listening') {
      handleStopRecording();
    }
  }, [orbState, currentPhrase, handleStartRecording, handleStopRecording]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 shrink-0">
        <Tooltip label={t('settings.title', lang)}>
          <button
            onClick={() => setModalState('settings')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300"
            aria-label={t('settings.title', lang)}
          >
            <Settings className="w-5 h-5" />
          </button>
        </Tooltip>

        <div className="flex items-center gap-2">
          <span className="font-bold font-[family-name:var(--font-heading)] text-white/60 text-sm">
            PronounceAI
          </span>
          {phraseCount > 0 && (
            <span className="text-xs text-white/30 tabular-nums">#{phraseCount}</span>
          )}
        </div>

        <Tooltip label={t('progress.title', lang)}>
          <button
            onClick={() => setModalState('progress')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] backdrop-blur-sm transition-all duration-300"
            aria-label={t('progress.title', lang)}
          >
            <BarChart3 className="w-5 h-5" />
          </button>
        </Tooltip>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-8 min-h-0">
        {/* Phrase display */}
        <AnimatePresence mode="wait">
          {currentPhrase ? (
            <motion.div
              key={currentPhrase.phrase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-2 max-w-lg"
            >
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text-white">
                {currentPhrase.phrase}
              </h2>
              <p className="text-sm text-white/30 font-mono">
                {currentPhrase.phonetic}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Center interactive element */}
        <motion.button
          onClick={handleMicTap}
          disabled={orbState === 'processing' || (!currentPhrase && orbState === 'idle')}
          whileTap={{ scale: 0.95 }}
          className="relative w-28 h-28 rounded-full border backdrop-blur-md flex items-center justify-center transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label={orbState === 'listening' ? t('practice.stop', lang) : t('practice.speak', lang)}
          style={{
            borderColor: orbState === 'score' && scoringResult
              ? `${getScoreColor(scoringResult.score)}40`
              : orbState === 'listening'
              ? 'rgba(239, 68, 68, 0.3)'
              : 'rgba(255, 255, 255, 0.1)',
            backgroundColor: orbState === 'score' && scoringResult
              ? `${getScoreColor(scoringResult.score)}10`
              : orbState === 'listening'
              ? 'rgba(239, 68, 68, 0.08)'
              : 'rgba(255, 255, 255, 0.04)',
          }}
        >
          {orbState === 'listening' && (
            <motion.div
              className="absolute inset-0 rounded-full border border-red-400/20"
              animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          {orbState === 'idle' && <Mic className="w-8 h-8 text-white/50" />}
          {orbState === 'listening' && (
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Mic className="w-8 h-8 text-red-400" />
            </motion.div>
          )}
          {orbState === 'processing' && <Loader2 className="w-8 h-8 text-white/50 animate-spin" />}
          {orbState === 'score' && scoringResult && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-3xl font-bold font-[family-name:var(--font-heading)]"
              style={{ color: getScoreColor(scoringResult.score) }}
            >
              {scoringResult.score}
            </motion.span>
          )}
        </motion.button>

        {/* Transcript while listening */}
        <AnimatePresence>
          {orbState === 'listening' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-md bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4"
            >
              <p className="text-xs text-white/30 mb-1">{t('practice.saying', lang)}</p>
              <p className="text-white min-h-[24px]">
                {transcript || <span className="text-white/20 italic">{t('practice.listening', lang)}</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls — icon-only glass buttons */}
        <div className="flex gap-3 items-center">
          <Tooltip label={t('practice.listen', lang)} position="top">
            <button
              onClick={playTTS}
              disabled={!currentPhrase || isPlayingTTS || orbState === 'listening' || orbState === 'processing'}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300"
              aria-label={t('practice.listen', lang)}
            >
              {isPlayingTTS ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </Tooltip>

          {orbState === 'listening' ? (
            <Tooltip label={t('practice.stop', lang)} position="top">
              <button
                onClick={handleStopRecording}
                className="w-12 h-12 rounded-full border border-red-400/20 bg-red-400/10 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-red-400/15 transition-all duration-300"
                aria-label={t('practice.stop', lang)}
              >
                <Square className="w-5 h-5" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip label={t('practice.speak', lang)} position="top">
              <button
                onClick={handleStartRecording}
                disabled={!currentPhrase || !isSupported || orbState === 'processing'}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/[0.12] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300"
                aria-label={t('practice.speak', lang)}
              >
                <Mic className="w-5 h-5" />
              </button>
            </Tooltip>
          )}

          <Tooltip label={t('practice.endSession', lang)} position="top">
            <button
              onClick={onEndSession}
              disabled={orbState === 'listening' || orbState === 'processing'}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300"
              aria-label={t('practice.endSession', lang)}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>

        {/* Error */}
        {(error || speechError) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400/80 text-center max-w-md"
          >
            {error || speechError}
          </motion.p>
        )}

        {!isSupported && (
          <p className="text-xs text-white/25 text-center">
            {t('practice.speechRequired', lang)}
          </p>
        )}
      </main>

      {/* Modals */}
      <FeedbackModal
        open={modalState === 'feedback'}
        result={scoringResult}
        userTranscription={lastTranscript}
        language={lang}
        onRetry={handleRetry}
        onContinue={handleContinue}
        onClose={() => setModalState('none')}
      />

      <ProgressModal
        open={modalState === 'progress'}
        language={lang}
        onClose={() => setModalState('none')}
      />

      <SettingsModal
        open={modalState === 'settings'}
        language={lang}
        onClose={() => setModalState('none')}
        onSettingsChanged={handleSettingsChanged}
      />
    </div>
  );
}
