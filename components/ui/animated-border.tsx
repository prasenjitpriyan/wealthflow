'use client';

import { cn } from '@/lib/utils';
import { useId } from 'react';

interface AnimatedBorderProps {
  className?: string;
  duration?: string;
  colorFrom?: string;
  colorTo?: string;
}

export function AnimatedBorder({
  className,
  duration = '5s',
  colorFrom = 'oklch(var(--primary))',
  colorTo = 'transparent',
}: AnimatedBorderProps) {
  const gradientId = useId();
  const filterId = useId();

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 pointer-events-none rounded-[inherit]',
        className
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full rounded-[inherit]"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorFrom} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          ry="12"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          pathLength="100"
          strokeDasharray="30 70"
          strokeDashoffset="100"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          className="animate-svg-border"
          style={{
            animationDuration: duration,
          }}
        />
      </svg>
    </div>
  );
}
