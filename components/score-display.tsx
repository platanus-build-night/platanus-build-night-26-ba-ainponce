'use client';

import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/scoring';
import { getLocalizedScoreLabel } from '@/lib/i18n';
import type { Language } from '@/types';

interface ScoreDisplayProps {
  score: number;
  size?: number;
  language?: Language;
}

export function ScoreDisplay({ score, size = 180, language = 'en' }: ScoreDisplayProps) {
  const color = getScoreColor(score);
  const label = getLocalizedScoreLabel(score, language);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl font-bold font-[family-name:var(--font-heading)]"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-white/30">/ 100</span>
        </div>
      </div>
      <motion.p
        className="text-lg font-semibold font-[family-name:var(--font-heading)]"
        style={{ color }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
