'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowRight, X } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { ScoreDisplay } from '@/components/score-display';
import { FeedbackPanel } from '@/components/feedback-panel';
import { t } from '@/lib/i18n';
import type { ScoringResult, Language } from '@/types';

interface FeedbackModalProps {
  open: boolean;
  result: ScoringResult | null;
  userTranscription: string;
  language: Language;
  onRetry: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export function FeedbackModal({
  open,
  result,
  userTranscription,
  language,
  onRetry,
  onContinue,
  onClose,
}: FeedbackModalProps) {
  if (!result) return null;

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
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-black/30 backdrop-blur-xl border-t border-white/10"
          >
            <div className="p-6 space-y-6 max-w-2xl mx-auto">
              <div className="flex justify-center">
                <div className="w-10 h-1 rounded-full bg-white/10" />
              </div>

              <div className="flex justify-end -mt-4">
                <button onClick={onClose} className="text-white/30 hover:text-white transition-colors" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-center">
                <ScoreDisplay score={result.score} size={140} language={language} />
              </div>

              <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                <p className="text-xs text-white/30 mb-1">{t('feedback.youSaid', language)}</p>
                <p className="text-white">{userTranscription}</p>
              </div>

              <FeedbackPanel result={result} language={language} />

              <div className="flex gap-3 justify-center pb-4">
                <Tooltip label={t('feedback.tryAgain', language)} position="top">
                  <button
                    onClick={onRetry}
                    className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
                    aria-label={t('feedback.tryAgain', language)}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </Tooltip>

                <Tooltip label={t('feedback.continue', language)} position="top">
                  <button
                    onClick={onContinue}
                    className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/[0.12] transition-all duration-300"
                    aria-label={t('feedback.continue', language)}
                  >
                    <ArrowRight className="w-5 h-5" />
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
