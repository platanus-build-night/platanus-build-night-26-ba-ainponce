'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowUp } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { LevelUpEvent, Language } from '@/types';

interface LevelUpCelebrationProps {
  event: LevelUpEvent | null;
  language: Language;
  onDismiss: () => void;
}

export function LevelUpCelebration({ event, language, onDismiss }: LevelUpCelebrationProps) {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [event, onDismiss]);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Zap className="w-16 h-16 text-yellow-400" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold font-[family-name:var(--font-heading)] text-white"
            >
              {t('level.levelUp', language)}
            </motion.p>

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.4 }}
              className="text-6xl font-bold font-[family-name:var(--font-heading)] text-yellow-400"
            >
              {event.newLevel}
            </motion.span>

            {event.newTier && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 bg-white/[0.08] border border-white/15 rounded-full px-4 py-2"
              >
                <ArrowUp className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">
                  {t('level.newTier', language)}{' '}
                  <span className="font-bold text-green-400">
                    {t(`level.${event.newTier}`, language)}
                  </span>
                </span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
