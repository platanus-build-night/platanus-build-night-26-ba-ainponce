'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Language } from '@/types';

interface ShortcutsModalProps {
  open: boolean;
  language: Language;
  onClose: () => void;
}

const shortcuts = [
  { key: 'Space', i18nKey: 'shortcuts.spaceDesc' },
  { key: 'Enter', i18nKey: 'shortcuts.enterDesc' },
  { key: 'Esc', i18nKey: 'shortcuts.escapeDesc' },
] as const;

export function ShortcutsModal({ open, language, onClose }: ShortcutsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm pointer-events-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-white/90">
                  {t('shortcuts.title', language)}
                </h3>
                <button
                  onClick={onClose}
                  className="text-white/30 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map(({ key, i18nKey }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      {t(i18nKey, language)}
                    </span>
                    <kbd className="bg-white/[0.06] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white/50">
                      {key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
