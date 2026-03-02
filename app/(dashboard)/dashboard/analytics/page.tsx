'use client';

import { OverviewChart } from '@/components/dashboard/overview-chart';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const monthlyComparison = [
  { month: 'Sep', budget: 3700, actual: 4100 },
  { month: 'Oct', budget: 3700, actual: 5200 },
  { month: 'Nov', budget: 3700, actual: 4600 },
  { month: 'Dec', budget: 4000, actual: 6100 },
  { month: 'Jan', budget: 3700, actual: 4400 },
  { month: 'Feb', budget: 3700, actual: 4830 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
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
            <span className="font-medium">${e.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deep dive into your financial patterns and trends.
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="h-8 text-xs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OverviewChart />
            <SpendingChart />
          </div>

          {/* Budget vs Actual */}
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                Budget vs Actual Spending
              </CardTitle>
              <CardDescription>
                Monthly comparison over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={monthlyComparison}
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
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="budget"
                    fill="var(--chart-2)"
                    radius={[4, 4, 0, 0]}
                    name="budget"
                  />
                  <Bar dataKey="actual" radius={[4, 4, 0, 0]} name="actual">
                    {monthlyComparison.map((entry, i) => (
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
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-2 justify-center text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded bg-chart-2" />
                  Budget
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded bg-chart-1" />
                  Under budget
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 rounded bg-chart-5" />
                  Over budget
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="mt-4">
          <SpendingChart />
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <OverviewChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
