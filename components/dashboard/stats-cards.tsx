'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  gradient?: string;
}

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  gradient,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-border/50 hover:border-primary/20 transition-colors duration-200 group">
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          gradient
        )}
      />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-muted/60">{icon}</div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p
          className={cn('text-xs mt-1 flex items-center gap-1', {
            'text-emerald-500 dark:text-emerald-400': changeType === 'positive',
            'text-red-500 dark:text-red-400': changeType === 'negative',
            'text-muted-foreground': changeType === 'neutral',
          })}>
          {changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
          {changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Total Balance',
      value: '$24,563.00',
      change: '+2.5% from last month',
      changeType: 'positive' as const,
      icon: <Wallet className="w-4 h-4 text-primary" />,
    },
    {
      title: 'Monthly Income',
      value: '$8,200.00',
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
    },
    {
      title: 'Monthly Expenses',
      value: '$4,830.50',
      change: '+4.1% from last month',
      changeType: 'negative' as const,
      icon: <ArrowDownRight className="w-4 h-4 text-red-500" />,
    },
    {
      title: 'Net Savings',
      value: '$3,369.50',
      change: '41% savings rate',
      changeType: 'neutral' as const,
      icon: <DollarSign className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
