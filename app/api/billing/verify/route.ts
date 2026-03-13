import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    await req.json();

  // Verify HMAC signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
  }

  // Upgrade user plan
  await prisma.user.update({
    where: { id: session.user.id },
    data: { plan: 'PRO', planSince: new Date() },
  });

  return NextResponse.json({ success: true, plan: 'PRO' });
}
