'use client';

import {
  Bar,
  CartesianGrid,
  Cell,
  BarChart as RechartsBarChart,
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
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((e) => (
          <div key={e.name} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: e.color }}
            />
            <span className="capitalize text-muted-foreground">{e.name}:</span>
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency,
                maximumFractionDigits: 0,
              }).format(e.value)}{' '}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function BudgetChart({
  data,
  currency = 'INR',
}: {
  data: { month: string; budget: number; actual: number }[];
  currency?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RechartsBarChart
        data={data}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
        <Bar
          dataKey="budget"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
          name="budget"
        />
        <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="actual">
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.actual > entry.budget
                  ? 'var(--chart-5)'
                  : 'var(--chart-1)'
              }
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
