import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const rawBody = await req.text();

  // Validate webhook signature
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const eventType: string = event.event;

  try {
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const notes = event.payload?.payment?.entity?.notes ?? event.payload?.order?.entity?.notes;
      const userId = notes?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan: 'PRO', planSince: new Date() },
        });
      }
    }

    if (eventType === 'payment.failed') {
      // You could send an email here or log it
      console.warn('[WEBHOOK] Payment failed for order:', event.payload?.payment?.entity?.order_id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[WEBHOOK_RAZORPAY]', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
