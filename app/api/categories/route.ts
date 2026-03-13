import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1),
  icon: z.string().default('📁'),
  color: z.string().default('#6366f1'),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).default('EXPENSE'),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { transactions: true } } },
  });

  return NextResponse.json({ categories });
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
      const count = await prisma.category.count({ where: { userId: session.user.id } });
      if (count >= 3) {
        return NextResponse.json(
          { error: 'Category limit reached. Upgrade to Pro for unlimited categories.', code: 'PLAN_LIMIT_REACHED' },
          { status: 402 }
        );
      }
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const category = await prisma.category.create({
      data: { ...data, userId: session.user.id },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

