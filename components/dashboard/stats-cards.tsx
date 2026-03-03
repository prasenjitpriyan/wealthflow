'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Stats {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  incomeChange: number | null;
  expensesChange: number | null;
}

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function ChangeLabel({
  value,
  better,
}: {
  value: number | null;
  better: 'up' | 'down';
}) {
  if (value === null)
    return <span className="text-xs text-muted-foreground">No prior data</span>;
  const positive = better === 'up' ? value > 0 : value < 0;
  const type = positive ? 'positive' : value === 0 ? 'neutral' : 'negative';
  return (
    <p
      className={cn('text-xs mt-1 flex items-center gap-1', {
        'text-emerald-500 dark:text-emerald-400': type === 'positive',
        'text-red-500 dark:text-red-400': type === 'negative',
        'text-muted-foreground': type === 'neutral',
      })}>
      {type === 'positive' && <ArrowUpRight className="w-3 h-3" />}
      {type === 'negative' && <ArrowDownRight className="w-3 h-3" />}
      {value > 0 ? '+' : ''}
      {value}% from last month
    </p>
  );
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const skeletonClass = 'h-7 w-24 bg-muted animate-pulse rounded';

  const cards = [
    {
      title: 'Monthly Income',
      value: loading ? null : fmt(stats?.income ?? 0),
      extra: <ChangeLabel value={stats?.incomeChange ?? null} better="up" />,
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Monthly Expenses',
      value: loading ? null : fmt(stats?.expenses ?? 0),
      extra: (
        <ChangeLabel value={stats?.expensesChange ?? null} better="down" />
      ),
      icon: <ArrowDownRight className="w-4 h-4 text-red-500" />,
    },
    {
      title: 'Net Savings',
      value: loading ? null : fmt(stats?.savings ?? 0),
      extra: (
        <p className="text-xs mt-1 text-muted-foreground">
          {stats?.savingsRate ?? 0}% savings rate
        </p>
      ),
      icon: <DollarSign className="w-4 h-4 text-amber-500" />,
    },
    {
      title: 'Savings Rate',
      value: loading ? null : `${stats?.savingsRate ?? 0}%`,
      extra: (
        <p className="text-xs mt-1 text-muted-foreground">Target: ≥ 20%</p>
      ),
      icon: <Wallet className="w-4 h-4 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="relative overflow-hidden border-border/50 hover:border-primary/20 transition-colors duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-muted/60">{card.icon}</div>
          </CardHeader>
          <CardContent className="relative">
            {loading ? (
              <div className={skeletonClass} />
            ) : (
              <div className="text-2xl font-bold tracking-tight">
                {card.value}
              </div>
            )}
            {!loading && card.extra}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
