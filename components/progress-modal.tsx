'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Clock,
  Trash2,
  Zap,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { getProgress, clearProgress } from '@/lib/storage';
import { getScoreColor } from '@/lib/scoring';
import { xpProgress, tierForLevel } from '@/lib/leveling';
import { t } from '@/lib/i18n';
import type { UserProgress, Language } from '@/types';

interface ProgressModalProps {
  open: boolean;
  language: Language;
  onClose: () => void;
}

export function ProgressModal({ open, language, onClose }: ProgressModalProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (open) {
      setProgress(getProgress());
    }
  }, [open]);

  const handleClear = () => {
    if (confirm(t('progress.clearConfirm', language))) {
      clearProgress();
      setProgress(getProgress());
    }
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
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 40, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-black/30 backdrop-blur-xl border-l border-white/10"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-white">
                  {t('progress.title', language)}
                </h2>
                <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!progress || progress.totalAttempts === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-white">
                    {t('progress.noSessions', language)}
                  </h3>
                  <p className="text-white/30 text-sm">
                    {t('progress.startPracticing', language)}
                  </p>
                </div>
              ) : (
                <>
                  {/* Level & XP */}
                  {(() => {
                    const xp = xpProgress(progress.xp);
                    const tier = tierForLevel(progress.level);
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold font-[family-name:var(--font-heading)] text-white">
                              {t('progress.levelLabel', language)} {progress.level}
                            </span>
                          </div>
                          <Badge variant="warning">
                            {t(`level.${tier}`, language)}
                          </Badge>
                        </div>
                        <ProgressBar value={xp.fraction * 100} color="#facc15" />
                        <p className="text-xs text-white/30 mt-1.5 text-right tabular-nums">
                          {xp.current} / {xp.needed} XP
                        </p>
                      </motion.div>
                    );
                  })()}

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Target, label: t('progress.totalAttempts', language), value: progress.totalAttempts, color: 'text-cyan-400' },
                      { icon: TrendingUp, label: t('progress.averageScore', language), value: progress.averageScore, color: 'text-green-400' },
                      { icon: Trophy, label: t('progress.bestScore', language), value: progress.bestScore, color: 'text-yellow-400' },
                      { icon: Flame, label: t('progress.dayStreak', language), value: progress.streakDays, color: 'text-orange-400' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                      >
                        <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                        <p className="text-xl font-bold font-[family-name:var(--font-heading)] text-white">
                          {stat.value}
                        </p>
                        <p className="text-xs text-white/30">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white/40 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t('progress.scoreTrend', language)}
                    </h3>
                    <div className="flex items-end gap-1 h-24">
                      {progress.history.slice(0, 10).reverse().map((attempt, i) => (
                        <motion.div
                          key={attempt.id}
                          initial={{ height: 0 }}
                          animate={{ height: `${attempt.score}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="flex-1 rounded-t-sm min-w-0"
                          style={{ backgroundColor: getScoreColor(attempt.score) }}
                          title={`Score: ${attempt.score}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-white/40 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t('progress.recentAttempts', language)}
                    </h3>
                    <div className="space-y-2">
                      {progress.history.slice(0, 10).map((attempt, i) => (
                        <motion.div
                          key={attempt.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-xl p-3 flex items-center gap-3"
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                            style={{
                              backgroundColor: `${getScoreColor(attempt.score)}15`,
                              color: getScoreColor(attempt.score),
                            }}
                          >
                            {attempt.score}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {attempt.targetPhrase}
                            </p>
                            <p className="text-xs text-white/30 truncate">
                              {t('progress.youSaid', language)} {attempt.userTranscription}
                            </p>
                          </div>
                          <Badge
                            variant={
                              attempt.language === 'en' ? 'info' : attempt.language === 'es' ? 'warning' : 'default'
                            }
                          >
                            {{ en: 'EN', es: 'ES', pt: 'PT' }[attempt.language]}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl p-5">
                    <h3 className="text-sm font-semibold text-white/40 mb-4">
                      {t('progress.averageByLevel', language)}
                    </h3>
                    {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
                      const lvlAttempts = progress.history.filter((a) => a.level === lvl);
                      const avg = lvlAttempts.length
                        ? Math.round(lvlAttempts.reduce((s, a) => s + a.score, 0) / lvlAttempts.length)
                        : 0;
                      return (
                        <div key={lvl} className="mb-3 last:mb-0">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-white/60">{t(`level.${lvl}`, language)}</span>
                            <span className="text-white/30">{avg}% ({lvlAttempts.length} {t('progress.attempts', language)})</span>
                          </div>
                          <ProgressBar value={avg} color={getScoreColor(avg)} />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center pb-4">
                    <Tooltip label={t('progress.clearAll', language)} position="top">
                      <button
                        onClick={handleClear}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all duration-300"
                        aria-label={t('progress.clearAll', language)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
