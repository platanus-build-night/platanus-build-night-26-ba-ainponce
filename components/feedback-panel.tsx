'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, MessageCircle, Lightbulb, Star, Volume2, Loader2 } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { ScoringResult, Language } from '@/types';
import { getScoreColor } from '@/lib/scoring';

interface FeedbackPanelProps {
  result: ScoringResult;
  language?: Language;
  onPlayWord?: (word: string) => Promise<void>;
}

export function FeedbackPanel({ result, language = 'en', onPlayWord }: FeedbackPanelProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handleWordTap = async (word: string, index: number) => {
    if (!onPlayWord || playingIndex !== null) return;
    setPlayingIndex(index);
    try {
      await onPlayWord(word);
    } finally {
      setPlayingIndex(null);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      {/* Overall Feedback */}
      <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white">{result.overallFeedback}</p>
            <p className="text-sm text-cyan-400/70 mt-2 italic">
              {result.encouragement}
            </p>
          </div>
        </div>
      </div>

      {/* Word Analysis */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-white/40 flex items-center gap-2">
          <Target className="w-4 h-4" />
          {t('feedbackPanel.wordAnalysis', language)}
        </h3>
        <div className="grid gap-2">
          {result.wordAnalysis.map((word, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              onClick={() => handleWordTap(word.target, i)}
              className={`bg-white/[0.04] backdrop-blur-sm border rounded-xl p-3 flex items-start gap-3 transition-all duration-200 ${
                playingIndex === i
                  ? 'border-cyan-400/40 bg-cyan-400/[0.06]'
                  : 'border-white/10'
              } ${onPlayWord ? 'cursor-pointer hover:bg-white/[0.06]' : ''}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${getScoreColor(word.score)}15`,
                  color: getScoreColor(word.score),
                }}
              >
                {word.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-white">{word.target}</span>
                  {word.spoken && word.spoken !== word.target && (
                    <>
                      <span className="text-white/30 text-xs">&rarr;</span>
                      <span className="text-sm text-red-400">{word.spoken}</span>
                    </>
                  )}
                  {!word.spoken && (
                    <span className="text-xs text-red-400">{t('feedbackPanel.missed', language)}</span>
                  )}
                </div>
                {word.issue !== 'correct' && (
                  <p className="text-xs text-white/40 mt-1">{word.issue}</p>
                )}
                <p className="text-xs text-purple-400/70 mt-1 flex items-start gap-1">
                  <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" />
                  {word.tip}
                </p>
              </div>
              {onPlayWord && (
                <div className="shrink-0 mt-0.5">
                  {playingIndex === i ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white/20" />
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Focus Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="bg-purple-400/[0.06] backdrop-blur-sm border border-purple-400/15 rounded-2xl p-4"
      >
        <div className="flex items-start gap-3">
          <Star className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider">
              {t('feedbackPanel.focusArea', language)}
            </p>
            <p className="text-sm text-white mt-1">
              {result.focusArea}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
