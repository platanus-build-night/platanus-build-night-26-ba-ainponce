'use client';

import type { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  label: string;
  position?: 'top' | 'bottom';
}

export function Tooltip({ children, label, position = 'bottom' }: TooltipProps) {
  return (
    <div className="relative group/tip">
      {children}
      <span
        className={`absolute left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/[0.05] text-white text-[11px] whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-200 z-50 ${
          position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
