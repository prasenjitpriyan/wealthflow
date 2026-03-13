'use client';

import { cn } from '@/lib/utils';

interface AnimatedBorderProps {
  className?: string;
  duration?: string;
}

export function AnimatedBorder({
  className,
  duration = '5s',
}: AnimatedBorderProps) {
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
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="12"
          ry="12"
          fill="none"
          strokeWidth="2"
          pathLength="100"
          strokeDasharray="30 70"
          strokeDashoffset="100"
          strokeLinecap="round"
          className="animate-svg-border stroke-primary/80"
          style={{
            animationDuration: duration,
          }}
        />
      </svg>
    </div>
  );
}
