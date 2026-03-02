'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const categories = [
  { name: 'Housing', value: 1500, color: 'var(--chart-1)' },
  { name: 'Food', value: 820, color: 'var(--chart-2)' },
  { name: 'Transport', value: 390, color: 'var(--chart-3)' },
  { name: 'Shopping', value: 640, color: 'var(--chart-4)' },
  { name: 'Health', value: 280, color: 'var(--chart-5)' },
  { name: 'Other', value: 200, color: 'oklch(0.6 0.1 240)' },
];

const total = categories.reduce((acc, c) => acc + c.value, 0);

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="rounded-lg border border-border bg-card p-2.5 shadow-lg text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: item.payload.color }}
          />
          <span className="font-medium">{item.name}</span>
        </div>
        <p className="text-muted-foreground mt-0.5">
          ${item.value.toLocaleString()} (
          {((item.value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export function SpendingChart() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Spending by Category
        </CardTitle>
        <CardDescription>This month&apos;s breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}>
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category bars */}
        <div className="space-y-2.5 mt-2">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
                <span className="font-medium">
                  ${cat.value.toLocaleString()}
                </span>
              </div>
              <Progress
                value={(cat.value / total) * 100}
                className="h-1.5"
                style={
                  {
                    '--progress-background': cat.color,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
