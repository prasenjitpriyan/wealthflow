'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeUp, stagger } from '@/lib/animations';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

interface Stats {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  incomeChange: number | null;
  expensesChange: number | null;
}

function fmt(n: number, currency: string = 'INR') {
  return formatCurrency(n, currency);
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

const cardColors = [
  {
    icon: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
    glow: '#10b981',
  },
  {
    icon: <ArrowDownRight className="w-4 h-4 text-red-500" />,
    glow: '#ef4444',
  },
  { icon: <DollarSign className="w-4 h-4 text-amber-500" />, glow: '#f59e0b' },
  { icon: <Wallet className="w-4 h-4 text-primary" />, glow: '#6366f1' },
];

export function StatsCards() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // GSAP counter for each number value
  useGSAP(
    () => {
      if (loading || !stats) return;
      const counters = containerRef.current?.querySelectorAll('.stat-value');
      counters?.forEach((el) => {
        const raw = parseFloat(el.getAttribute('data-value') ?? '0');
        const isPercent = el.getAttribute('data-unit') === '%';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: raw,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate() {
            el.textContent = isPercent
              ? `${obj.val.toFixed(1)}%`
              : fmt(obj.val, session?.user?.currency);
          },
        });
      });
    },
    { scope: containerRef, dependencies: [loading, stats] }
  );

  const skeletonClass = 'h-7 w-24 bg-muted animate-pulse rounded';
  const containerVariants = stagger(0, 0.09);

  const cards = [
    {
      title: 'Monthly Income',
      value: stats?.income ?? 0,
      unit: 'currency',
      extra: <ChangeLabel value={stats?.incomeChange ?? null} better="up" />,
    },
    {
      title: 'Monthly Expenses',
      value: stats?.expenses ?? 0,
      unit: 'currency',
      extra: (
        <ChangeLabel value={stats?.expensesChange ?? null} better="down" />
      ),
    },
    {
      title: 'Net Savings',
      value: stats?.savings ?? 0,
      unit: 'currency',
      extra: (
        <p className="text-xs mt-1 text-muted-foreground">
          {stats?.savingsRate ?? 0}% savings rate
        </p>
      ),
    },
    {
      title: 'Savings Rate',
      value: stats?.savingsRate ?? 0,
      unit: '%',
      extra: (
        <p className="text-xs mt-1 text-muted-foreground">Target: ≥ 20%</p>
      ),
    },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          variants={fadeUp}
          custom={i}
          whileHover={{
            y: -4,
            boxShadow: `0 16px 32px -8px ${cardColors[i].glow}28`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
          <Card className="relative overflow-hidden border-border/50 hover:border-primary/20 transition-colors duration-200 group h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <motion.div
                className="p-2 rounded-lg bg-muted/60"
                whileHover={{ scale: 1.12, rotate: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                {cardColors[i].icon}
              </motion.div>
            </CardHeader>
            <CardContent className="relative">
              {loading ? (
                <div className={skeletonClass} />
              ) : (
                <div
                  className="stat-value text-2xl font-bold tracking-tight"
                  data-value={card.value}
                  data-unit={card.unit}>
                  {card.unit === '%'
                    ? `${card.value}%`
                    : fmt(card.value, session?.user?.currency)}
                </div>
              )}
              {!loading && card.extra}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
