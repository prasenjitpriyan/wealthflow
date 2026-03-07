'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

function getScoreColor(s: number) {
  if (s >= 80) return 'text-emerald-500';
  if (s >= 60) return 'text-amber-500';
  return 'text-red-500';
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

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <CardTitle className="text-base font-semibold">
            Financial Health
          </CardTitle>
          <Badge variant={variant} className="ml-auto text-xs">
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Score ring simulation */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--muted)"
                strokeWidth="8"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeDasharray={`${(score / 100) * 163.4} 163.4`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
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
          {factors.map((f) => (
            <div key={f.label}>
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
              <Progress value={f.value} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
