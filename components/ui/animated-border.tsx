'use client';

import { cn } from '@/lib/utils';

interface AnimatedBorderProps {
  className?: string;
  duration?: string;
}

export function AnimatedBorder({
  className,
  duration = '4s',
}: AnimatedBorderProps) {
  return (
    <div
      className={cn(
        'absolute -inset-px z-0 overflow-hidden pointer-events-none rounded-[inherit]',
        className
      )}
    >
      <div
        className="absolute -inset-full w-[300%] h-[300%] opacity-50 dark:opacity-70 animate-[spin_auto_linear_infinite]"
        style={{ animationDuration: duration }}
      >
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,oklch(var(--primary))_360deg)]" />
      </div>
      <div className="absolute inset-px bg-card rounded-[calc(inherit-1px)]" />
    </div>
  );
}
