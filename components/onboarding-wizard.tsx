'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { saveSettings } from '@/lib/storage';
import { setWaterColorsByLanguage } from '@/lib/water-state';
import { t, topicKeys } from '@/lib/i18n';
import type { AppSettings, Language, Level } from '@/types';

interface OnboardingWizardProps {
  onComplete: (settings: AppSettings) => void;
}

type Step = 'welcome' | 'language' | 'level' | 'topic' | 'apikey';
const allSteps: Step[] = ['welcome', 'language', 'level', 'topic', 'apikey'];

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'https://flagcdn.com/w160/us.png' },
  { value: 'es', label: 'Español', flag: 'https://flagcdn.com/w160/es.png' },
  { value: 'pt', label: 'Português', flag: 'https://flagcdn.com/w160/br.png' },
];

const levelValues: Level[] = ['beginner', 'intermediate', 'advanced'];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<Language>('en');
  const [level, setLevel] = useState<Level>('beginner');
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [hasServerApiKey, setHasServerApiKey] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => { if (data.hasApiKey) setHasServerApiKey(true); })
      .catch(() => {});
  }, []);

  const steps = useMemo<Step[]>(
    () => hasServerApiKey ? allSteps.filter((s) => s !== 'apikey') : allSteps,
    [hasServerApiKey],
  );

  const step = steps[currentStep];
  const lang = currentStep >= 2 ? language : 'en';

  const canContinue = () => {
    switch (step) {
      case 'welcome': return true;
      case 'language': return true;
      case 'level': return true;
      case 'topic': return topic.trim().length > 0;
      case 'apikey': return apiKey.trim().length > 0;
    }
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      const settings: AppSettings = { language, level, topic: topic.trim(), apiKey: apiKey.trim() };
      saveSettings(settings);
      onComplete(settings);
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setWaterColorsByLanguage(lang);
  };

  const progress = currentStep > 0 ? (currentStep - 1) / (steps.length - 2) : 0;

  const isLastStep = currentStep === steps.length - 1;

  // Tooltip labels
  const backLabel = currentStep >= 2 ? t('onboarding.back', lang) : 'Back';
  const nextLabel = step === 'welcome'
    ? 'Get Started'
    : isLastStep
    ? t('onboarding.startPracticing', lang)
    : currentStep >= 2
    ? t('onboarding.continue', lang)
    : 'Continue';

  const contentVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {/* Welcome */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="text-center"
            >
              <motion.img
                src="/logo.png"
                alt="PronounceAI"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="h-52 md:h-72 w-auto mx-auto"
              />
            </motion.div>
          )}

          {/* Other steps */}
          {step !== 'welcome' && (
            <motion.div
              key={step}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full max-w-md"
            >
              {/* Language */}
              {step === 'language' && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-white">
                      Choose your language
                    </h2>
                    <p className="text-sm text-white/40 mt-1">Select the language you want to practice</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleLanguageSelect(opt.value)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                          language === opt.value
                            ? 'border-white/25 bg-white/10'
                            : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden shadow-lg">
                          <img src={opt.flag} alt={opt.label} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                          language === opt.value ? 'text-white' : 'text-white/50'
                        }`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Level */}
              {step === 'level' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-white">
                      {t('onboarding.chooseLevel', lang)}
                    </h2>
                    <p className="text-sm text-white/40 mt-1">{t('onboarding.levelDesc', lang)}</p>
                  </div>
                  <div className="space-y-3">
                    {levelValues.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`w-full p-4 rounded-2xl border backdrop-blur-sm text-left transition-all duration-300 ${
                          level === lvl
                            ? 'border-white/25 bg-white/10'
                            : 'border-white/5 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                        }`}
                      >
                        <p className="font-medium text-white">
                          {t(`onboarding.${lvl}`, lang)}
                        </p>
                        <p className="text-sm text-white/40 mt-0.5">
                          {t(`onboarding.${lvl}Desc`, lang)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Topic */}
              {step === 'topic' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-white">
                      {t('onboarding.chooseTopic', lang)}
                    </h2>
                    <p className="text-sm text-white/40 mt-1">{t('onboarding.topicDesc', lang)}</p>
                  </div>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('onboarding.topicPlaceholder', lang)}
                    className="w-full bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 text-white text-lg placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors duration-300"
                    autoFocus
                  />
                  <div className="flex flex-wrap gap-2">
                    {topicKeys.map((key) => {
                      const label = t(key, lang);
                      return (
                        <button
                          key={key}
                          onClick={() => setTopic(label)}
                          className={`px-4 py-2 rounded-full text-sm border backdrop-blur-sm transition-all duration-300 ${
                            topic === label
                              ? 'border-white/25 bg-white/10 text-white'
                              : 'border-white/5 bg-white/[0.03] text-white/50 hover:border-white/15 hover:text-white/70'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* API Key */}
              {step === 'apikey' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] text-white">
                      {t('onboarding.apiKeyTitle', lang)}
                    </h2>
                    <p className="text-sm text-white/40 mt-1">{t('onboarding.apiKeyDesc', lang)}</p>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-sm placeholder:text-white/25 focus:outline-none focus:border-white/25 transition-colors duration-300"
                    autoFocus
                  />
                  <p className="text-sm text-white/40 text-center">
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white/60 underline underline-offset-4 transition-colors"
                    >
                      {t('onboarding.getApiKey', lang)}
                    </a>
                  </p>
                  <div className="bg-white/[0.03] backdrop-blur-sm border border-white/5 rounded-xl p-4 text-xs text-white/30">
                    {t('onboarding.apiKeyNote', lang)}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: progress line + nav */}
      <div className="px-6 pb-8 space-y-6">
        {/* Line progress */}
        <AnimatePresence>
          {step !== 'welcome' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center"
            >
              <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/30 rounded-full"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation — icon-only buttons */}
        <div className="flex gap-3 justify-center items-center">
          {currentStep > 0 && step !== 'welcome' && (
            <Tooltip label={backLabel} position="top">
              <button
                onClick={handleBack}
                className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                aria-label={backLabel}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Tooltip>
          )}

          <Tooltip label={nextLabel} position="top">
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/[0.12] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
              aria-label={nextLabel}
            >
              {isLastStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
