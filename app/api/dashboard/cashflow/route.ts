import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

type Range = '1m' | '3m' | '6m' | '1y';

const rangeToMonths: Record<Range, number> = {
  '1m': 1,
  '3m': 3,
  '6m': 6,
  '1y': 12,
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = req.nextUrl;
  const range = (searchParams.get('range') as Range) ?? '6m';
  const months = rangeToMonths[range] ?? 6;

  const now = new Date();

  const results: { month: string; income: number; expenses: number }[] = [];

  // Build array of month slots from oldest → newest
  const promises = [];
  for (let i = months - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

    promises.push(
      Promise.all([
        prisma.transaction.aggregate({
          where: { userId, type: 'INCOME', date: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { userId, type: 'EXPENSE', date: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
        // Keep the label for ordering purposes
        Promise.resolve(
          start.toLocaleDateString('en-US', {
            month: 'short',
            year: months > 6 ? '2-digit' : undefined,
          })
        ),
      ])
    );
  }

  const settled = await Promise.all(promises);

  for (const [inc, exp, label] of settled) {
    results.push({
      month: label as string,
      income: Number((inc as { _sum: { amount: unknown } })._sum.amount ?? 0),
      expenses: Number((exp as { _sum: { amount: unknown } })._sum.amount ?? 0),
    });
  }

  return NextResponse.json(results);
}
