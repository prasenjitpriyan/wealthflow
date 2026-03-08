'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useRef } from 'react';

function getScoreColor(s: number) {
  if (s >= 80) return 'text-emerald-500';
  if (s >= 60) return 'text-amber-500';
  return 'text-red-500';
}

function getScoreStroke(s: number) {
  if (s >= 80) return '#10b981';
  if (s >= 60) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(s: number) {
  if (s >= 80) return { label: 'Excellent', variant: 'default' as const };
  if (s >= 60) return { label: 'Good', variant: 'secondary' as const };
  return { label: 'Needs Work', variant: 'destructive' as const };
}

const getIconForLabel = (label: string) => {
  if (label.includes('Savings')) return TrendingUp;
  if (label.includes('Budget')) return AlertCircle;
  if (label.includes('Emergency')) return ShieldCheck;
  return TrendingUp;
};

const circumference = 2 * Math.PI * 26; // r=26 → 163.36

export function FinancialHealthScore({
  score,
  factors,
}: {
  score: number;
  factors: {
    label: string;
    value: number;
    status: 'good' | 'medium' | 'bad';
    note: string;
  }[];
}) {
  const { label, variant } = getScoreLabel(score);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <Sparkles className="w-4 h-4 text-primary" />
          </motion.div>
          <CardTitle className="text-base font-semibold">
            Financial Health
          </CardTitle>
          <Badge variant={variant} className="ml-auto text-xs">
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent ref={ref}>
        {/* Animated score ring */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="8"
              />
              {/* Animated arc */}
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke={getScoreStroke(score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={
                  isInView
                    ? { strokeDashoffset: dashOffset }
                    : { strokeDashoffset: circumference }
                }
                transition={{
                  duration: 1.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 0.2,
                }}
              />
            </svg>
            {/* Score number count-up */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className={`text-lg font-bold ${getScoreColor(score)}`}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}>
                {score}
              </motion.span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">
              Your score is {label.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Improve budget adherence to boost your score
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {factors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}>
              <div className="flex justify-between items-center text-xs mb-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  {(() => {
                    const Icon = getIconForLabel(f.label);
                    return <Icon className="w-3.5 h-3.5" />;
                  })()}
                  {f.label}
                </div>
                <span
                  className={
                    f.status === 'good'
                      ? 'text-emerald-500'
                      : f.status === 'medium'
                        ? 'text-amber-500'
                        : 'text-red-500'
                  }>
                  {f.note}
                </span>
              </div>
              {/* Animated progress bar */}
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    f.status === 'good'
                      ? 'bg-emerald-500'
                      : f.status === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${f.value}%` } : { width: 0 }}
                  transition={{
                    duration: 1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: 0.4 + i * 0.1,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
