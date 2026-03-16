import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { BudgetChart } from '@/components/dashboard/budget-chart';
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
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true },
  });
  const currency = user?.currency || 'INR';

  const now = new Date();

  // Monthly Flow (Last 6 Months)
  const monthlyData = [];
  const monthlyComparison = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      0,
      23,
      59,
      59
    );

    const [inc, exp, budgetGroups] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME', date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE', date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.budget.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
    ]);

    const incomeVal = Number(inc._sum.amount || 0);
    const expensesVal = Number(exp._sum.amount || 0);
    const budgetVal = Number(budgetGroups._sum.amount || 0) || 50000; // Provide fake budget if none set for chart demo

    const monthStr = start.toLocaleDateString('en-US', { month: 'short' });
    monthlyData.push({
      month: monthStr,
      income: incomeVal,
      expenses: expensesVal,
    });
    monthlyComparison.push({
      month: monthStr,
      budget: budgetVal,
      actual: expensesVal,
    });
  }

  // Spending by Category (Current Month)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const categoryGroups = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });

  const categoryDetails = await prisma.category.findMany({
    where: {
      id: {
        in: categoryGroups.map((g: { categoryId: string | null }) => g.categoryId).filter(Boolean) as string[],
      },
    },
  });

  const categories = categoryGroups
    .map((g: { categoryId: string | null; _sum: { amount: Prisma.Decimal | null } }) => {
      const cat = categoryDetails.find((c) => c.id === g.categoryId);
      return {
        name: cat?.name || 'Uncategorized',
        value: Number(g._sum.amount || 0),
        color: cat?.color || 'oklch(0.6 0.1 240)',
      };
    })
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (categories.length === 0) {
    categories.push({ name: 'No spending yet', value: 1, color: '#e5e7eb' });
  }

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
            <OverviewChart currency={currency} />
            <SpendingChart categories={categories} currency={currency} />
          </div>

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
              <BudgetChart data={monthlyComparison} currency={currency} />

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
          <SpendingChart categories={categories} currency={currency} />
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <OverviewChart currency={currency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
