import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const [incomeResult, expenseResult, prevIncomeResult, prevExpenseResult] =
    await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          date: {
            gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            lte: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
          },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          date: {
            gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            lte: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59),
          },
        },
        _sum: { amount: true },
      }),
    ]);

  const income = Number(incomeResult._sum.amount ?? 0);
  const expenses = Number(expenseResult._sum.amount ?? 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const prevIncome = Number(prevIncomeResult._sum.amount ?? 0);
  const prevExpenses = Number(prevExpenseResult._sum.amount ?? 0);

  const pctChange = (curr: number, prev: number) =>
    prev === 0 ? null : Math.round(((curr - prev) / prev) * 100);

  return NextResponse.json({
    income,
    expenses,
    savings,
    savingsRate,
    incomeChange: pctChange(income, prevIncome),
    expensesChange: pctChange(expenses, prevExpenses),
  });
}
