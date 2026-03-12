'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

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

export function OverviewChart({
  data,
  currency = 'INR',
}: {
  data: { month: string; income: number; expenses: number }[];
  currency?: string;
}) {
  return (
    <Card animatedBorder className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Cash Flow Overview
            </CardTitle>
            <CardDescription>
              Income vs expenses over the last 6 months
            </CardDescription>
          </div>
          <Tabs defaultValue="6m">
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
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="var(--chart-5)"
              strokeWidth={2}
              fill="url(#expenseGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
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
