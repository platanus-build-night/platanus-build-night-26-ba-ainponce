'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getProgress } from '@/lib/storage';
import { xpProgress } from '@/lib/leveling';

export function LevelBadge() {
  const [level, setLevel] = useState(1);
  const [fraction, setFraction] = useState(0);

  const refresh = () => {
    const progress = getProgress();
    setLevel(progress.level);
    setFraction(xpProgress(progress.xp).fraction);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('xp-updated', handler);
    return () => window.removeEventListener('xp-updated', handler);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      <Zap className="w-3.5 h-3.5 text-yellow-400" />
      <span className="text-xs font-bold text-white/60 tabular-nums">{level}</span>
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-yellow-400"
          initial={{ width: 0 }}
          animate={{ width: `${fraction * 100}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        />
      </div>
    </div>
  );
}
