import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getPlanLimits } from '@/lib/plans';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, planSince: true },
  });

  const plan = (user?.plan ?? 'FREE') as 'FREE' | 'PRO';
  const limits = getPlanLimits(plan);

  // Count transactions this calendar month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [txCount, categoryCount, budgetCount] = await Promise.all([
    prisma.transaction.count({
      where: { userId: session.user.id, date: { gte: monthStart } },
    }),
    prisma.category.count({ where: { userId: session.user.id } }),
    prisma.budget.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({
    plan,
    planSince: user?.planSince ?? null,
    limits,
    usage: {
      transactionsThisMonth: txCount,
      categories: categoryCount,
      budgets: budgetCount,
    },
  });
}
