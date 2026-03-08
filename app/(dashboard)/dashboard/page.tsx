import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { FinancialHealthScore } from '@/components/dashboard/financial-health';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // 1. User preferences
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true, name: true },
  });
  const currency = user?.currency || 'INR';
  const firstName = user?.name?.split(' ')[0] || 'there';

  // 2. Recent Transactions
  const rawTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 6,
    include: { category: true },
  });

  const transactions = rawTransactions.map((tx) => ({
    id: tx.id,
    description: tx.description,
    category: tx.category?.name || 'Uncategorized',
    amount: Number(tx.amount),
    date: tx.date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    emoji: tx.category?.icon || '💸',
  }));

  // 3. Current Month Bounds
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  // 4. Spending by Category (Current Month)
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
        in: categoryGroups.map((g) => g.categoryId).filter(Boolean) as string[],
      },
    },
  });

  const categories = categoryGroups
    .map((g) => {
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

  // Fill with a dummy category if nothing is spent yet so the chart doesn't break
  if (categories.length === 0) {
    categories.push({ name: 'No spending yet', value: 1, color: '#e5e7eb' });
  }

  // 5. Monthly Flow (Last 6 Months)
  const monthlyData = [];
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

    const [inc, exp] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'INCOME', date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE', date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
    ]);

    monthlyData.push({
      month: start.toLocaleDateString('en-US', { month: 'short' }),
      income: Number(inc._sum.amount || 0),
      expenses: Number(exp._sum.amount || 0),
    });
  }

  // 6. Financial Health Metrics
  // Calculate basic savings rate for the month
  const currentInc = monthlyData[5].income;
  const currentExp = monthlyData[5].expenses;
  const savingsRate =
    currentInc > 0
      ? Math.round(((currentInc - currentExp) / currentInc) * 100)
      : 0;

  const score = Math.max(0, Math.min(100, 50 + savingsRate * 1.5)); // simple metric

  const healthFactors: {
    label: string;
    value: number;
    status: 'good' | 'medium' | 'bad';
    note: string;
  }[] = [
    {
      label: 'Savings Rate',
      value: Math.max(0, Math.min(100, savingsRate)),
      status: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'medium' : 'bad',
      note: `${savingsRate}%`,
    },
    {
      label: 'Budget Tracking',
      value: categories.length > 1 ? 80 : 40,
      status: categories.length > 1 ? 'good' : 'medium',
      note: categories.length > 1 ? 'Active' : 'Needs setup',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s your financial overview for{' '}
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
        </p>
      </div>

      {/* Stats Row */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OverviewChart data={monthlyData} currency={currency} />
        </div>
        <div>
          <SpendingChart categories={categories} currency={currency} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} currency={currency} />
        </div>
        <div>
          <FinancialHealthScore
            score={Math.round(score)}
            factors={healthFactors}
          />
        </div>
      </div>
    </div>
  );
}
