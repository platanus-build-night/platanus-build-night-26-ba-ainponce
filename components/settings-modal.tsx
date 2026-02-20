'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { getSettings, saveSettings } from '@/lib/storage';
import { setWaterColorsByLanguage } from '@/lib/water-state';
import { t } from '@/lib/i18n';
import type { AppSettings, Language, Level } from '@/types';

interface SettingsModalProps {
  open: boolean;
  language: Language;
  onClose: () => void;
  onSettingsChanged: (changed: { language: boolean; level: boolean; topic: boolean }) => void;
}

const languages: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'https://flagcdn.com/w80/us.png' },
  { value: 'es', label: 'Español', flag: 'https://flagcdn.com/w80/es.png' },
  { value: 'pt', label: 'Português', flag: 'https://flagcdn.com/w80/br.png' },
];

const levelValues: Level[] = ['beginner', 'intermediate', 'advanced'];

export function SettingsModal({ open, language: currentLang, onClose, onSettingsChanged }: SettingsModalProps) {
  const [language, setLanguage] = useState<Language>('en');
  const [level, setLevel] = useState<Level>('beginner');
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [originalSettings, setOriginalSettings] = useState<AppSettings | null>(null);

  const lang = language;

  useEffect(() => {
    if (open) {
      const settings = getSettings();
      if (settings) {
        setLanguage(settings.language);
        setLevel(settings.level);
        setTopic(settings.topic);
        setApiKey(settings.apiKey);
        setOriginalSettings(settings);
      }
    }
  }, [open]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setWaterColorsByLanguage(newLang);
  };

  const handleSave = () => {
    const newSettings: AppSettings = { language, level, topic, apiKey };
    saveSettings(newSettings);

    const changed = {
      language: originalSettings?.language !== language,
      level: originalSettings?.level !== level,
      topic: originalSettings?.topic !== topic,
    };

    onSettingsChanged(changed);
    onClose();
  };

  const handleClose = () => {
    if (originalSettings) {
      setWaterColorsByLanguage(originalSettings.language);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-full max-w-md overflow-y-auto bg-black/30 backdrop-blur-xl border-r border-white/10"
          >
            <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-white">
                    {t('settings.title', lang)}
                  </h2>
                  <button onClick={handleClose} className="text-white/30 hover:text-white transition-colors" aria-label="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-white/40 mb-2">
                    {t('settings.language', lang)}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleLanguageChange(opt.value)}
                        className={`p-3 rounded-xl border backdrop-blur-sm text-center transition-all duration-300 flex flex-col items-center gap-2 ${
                          language === opt.value
                            ? 'border-white/25 bg-white/10'
                            : 'border-white/5 bg-white/[0.03] hover:border-white/15'
                        }`}
                      >
                        <div className="w-10 h-7 rounded overflow-hidden">
                          <img src={opt.flag} alt={opt.label} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs text-white/60">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-semibold text-white/40 mb-2">
                    {t('settings.level', lang)}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {levelValues.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setLevel(lvl)}
                        className={`p-3 rounded-xl border backdrop-blur-sm text-center transition-all duration-300 text-sm ${
                          level === lvl
                            ? 'border-white/25 bg-white/10 text-white'
                            : 'border-white/5 bg-white/[0.03] hover:border-white/15 text-white/40'
                        }`}
                      >
                        {t(`level.${lvl}`, lang)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="block text-sm font-semibold text-white/40 mb-2">
                    {t('settings.topic', lang)}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('settings.topicPlaceholder', lang)}
                    className="w-full bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>

                {/* API Key */}
                <div>
                  <label className="block text-sm font-semibold text-white/40 mb-2">
                    {t('settings.apiKey', lang)}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors font-mono text-sm"
                  />
                  <p className="text-xs text-white/25 mt-1">
                    <a
                      href="https://console.anthropic.com/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white/50 underline underline-offset-4"
                    >
                      {t('settings.getApiKey', lang)}
                    </a>
                  </p>
                </div>

                {/* Save — icon-only centered */}
                <div className="flex justify-center pt-1">
                  <Tooltip label={t('settings.save', lang)} position="top">
                    <button
                      onClick={handleSave}
                      className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/[0.12] transition-all duration-300"
                      aria-label={t('settings.save', lang)}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
