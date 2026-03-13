import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.string(),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') as
    | 'INCOME'
    | 'EXPENSE'
    | 'TRANSFER'
    | null;
  const categoryId = searchParams.get('categoryId');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 200);
  const page = Math.max(parseInt(searchParams.get('page') ?? '1'), 1);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        ...(type && { type }),
        ...(categoryId && { categoryId }),
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, icon: true, color: true } },
      },
    }),
    prisma.transaction.count({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json({ transactions, total, page, limit });
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
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const count = await prisma.transaction.count({
        where: { userId: session.user.id, date: { gte: monthStart } },
      });
      if (count >= 50) {
        return NextResponse.json(
          { error: 'Monthly transaction limit reached. Upgrade to Pro for unlimited transactions.', code: 'PLAN_LIMIT_REACHED' },
          { status: 402 }
        );
      }
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        amount: data.amount,
        date: new Date(data.date),
        userId: session.user.id,
      },
      include: {
        category: { select: { name: true, icon: true, color: true } },
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message },
        { status: 400 }
      );
    }
    console.error('[TRANSACTIONS_POST]', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
