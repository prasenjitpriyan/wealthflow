import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

interface BudgetCategory {
  name: string;
  icon: string;
  color: string;
}

interface BudgetRow {
  id: string;
  userId: string;
  categoryId: string;
  amount: unknown;
  period: string;
  startDate: Date;
  endDate: Date | null;
  alertAt: number;
  createdAt: Date;
  updatedAt: Date;
  category: BudgetCategory | null;
}

const createSchema = z.object({
  categoryId: z.string(),
  amount: z.number().positive(),
  period: z
    .enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'])
    .default('MONTHLY'),
  startDate: z.string(),
  endDate: z.string().optional(),
  alertAt: z.number().min(1).max(100).default(80),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const budgets = await prisma.budget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, icon: true, color: true } },
    },
  });

  // Calculate spent for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget: BudgetRow) => {
      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: 'EXPENSE',
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
      });

      return {
        ...budget,
        amount: Number(budget.amount),
        spent: Number(spent._sum.amount ?? 0),
      };
    })
  );

  return NextResponse.json({ budgets: budgetsWithSpent });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Enforce Free plan limit
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    if (user?.plan === 'FREE') {
      const count = await prisma.budget.count({ where: { userId: session.user.id } });
      if (count >= 3) {
        return NextResponse.json(
          { error: 'Budget limit reached. Upgrade to Pro for unlimited budgets.', code: 'PLAN_LIMIT_REACHED' },
          { status: 402 }
        );
      }
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const budget = await prisma.budget.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        userId: session.user.id,
      },
      include: {
        category: { select: { name: true, icon: true, color: true } },
      },
    });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message },
        { status: 400 }
      );
    }
    console.error('[BUDGETS_POST]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
