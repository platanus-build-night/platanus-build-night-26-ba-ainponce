import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ glow, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-surface border border-border rounded-2xl p-6
        ${glow ? 'shadow-lg shadow-primary/10' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
