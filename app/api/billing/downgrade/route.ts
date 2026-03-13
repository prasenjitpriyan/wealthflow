import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { plan: 'FREE', planSince: null },
  });

  return NextResponse.json({ success: true, plan: 'FREE' });
}
