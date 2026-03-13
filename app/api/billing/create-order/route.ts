import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { razorpay } from '@/lib/razorpay';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// Pro plan price in paise (₹99 = 9900 paise)
const PRO_AMOUNT = 9900;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const order = await razorpay.orders.create({
      amount: PRO_AMOUNT,
      currency: 'INR',
      receipt: `pro_${session.user.id}_${Date.now()}`,
      notes: {
        userId: session.user.id,
        plan: 'PRO',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[BILLING_CREATE_ORDER]', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
