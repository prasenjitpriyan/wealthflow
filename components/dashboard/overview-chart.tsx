'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCallback, useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Range = '1m' | '3m' | '6m' | '1y';

type MonthData = {
  month: string;
  income: number;
  expenses: number;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  currency = 'INR',
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
  currency?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-sm">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">
              {entry.name}:
            </span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                maximumFractionDigits: 0,
              }).format(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const SkeletonBar = ({ delay = 0 }: { delay?: number }) => (
  <div
    className="h-full rounded bg-muted animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  />
);

export function OverviewChart({ currency = 'INR' }: { currency?: string }) {
  const [range, setRange] = useState<Range>('6m');
  const [data, setData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (r: Range) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/cashflow?range=${r}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silently fail — chart stays empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  return (
    <Card animatedBorder className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Cash Flow Overview
            </CardTitle>
            <CardDescription>Income vs expenses over the last {range === '1m' ? '1 month' : range === '3m' ? '3 months' : range === '6m' ? '6 months' : '12 months'}</CardDescription>
          </div>
          <Tabs
            value={range}
            onValueChange={(v) => setRange(v as Range)}
          >
            <TabsList className="h-7 text-xs">
              <TabsTrigger value="1m" className="h-5 px-2 text-xs">
                1M
              </TabsTrigger>
              <TabsTrigger value="3m" className="h-5 px-2 text-xs">
                3M
              </TabsTrigger>
              <TabsTrigger value="6m" className="h-5 px-2 text-xs">
                6M
              </TabsTrigger>
              <TabsTrigger value="1y" className="h-5 px-2 text-xs">
                1Y
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[220px] flex items-end gap-2 px-2 pb-6">
            {Array.from({ length: range === '1m' ? 4 : range === '3m' ? 6 : range === '6m' ? 6 : 12 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 h-full justify-end">
                <SkeletonBar delay={i * 60} />
              </div>
            ))}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-5)"
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                    notation: 'compact',
                    maximumFractionDigits: 1,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip currency={currency} />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                animationDuration={600}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="var(--chart-5)"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center gap-4 mt-2 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-chart-1" />
            Income
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded bg-chart-5" />
            Expenses
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
