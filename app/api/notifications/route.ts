import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export interface Notification {
  id: string;
  type: 'BUDGET_ALERT' | 'UPCOMING_BILL' | 'SYSTEM';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const notifications: Notification[] = [];
  const now = new Date();
  
  try {
    // 1. Check budgets nearing limits
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const budgets = await prisma.budget.findMany({
      where: { userId },
      include: { category: true }
    });

    for (const budget of budgets) {
      if (!budget.category) continue;
      
      const spentAggregation = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: 'EXPENSE',
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
      });

      const spent = Number(spentAggregation._sum.amount ?? 0);
      const limit = Number(budget.amount);
      const alertThreshold = limit * (budget.alertAt / 100);

      if (spent >= alertThreshold) {
        const percentage = Math.round((spent / limit) * 100);
        const isExceeded = spent >= limit;
        
        notifications.push({
          id: `budget-${budget.id}-${now.getMonth()}-${now.getFullYear()}`,
          type: 'BUDGET_ALERT',
          title: isExceeded ? 'Budget Exceeded' : 'Budget Alert',
          message: `You've spent ${percentage}% of your ${budget.category.name} budget.`,
          createdAt: new Date().toISOString(),
          read: false,
          actionUrl: '/dashboard/budgets',
        });
      }
    }

    // 2. Check upcoming recurring transactions (next 7 days)
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);

    const upcomingBills = await prisma.recurringTransaction.findMany({
      where: {
        userId,
        isActive: true,
        type: 'EXPENSE',
        nextDueDate: {
          gte: now,
          lte: nextWeek
        }
      }
    });

    for (const bill of upcomingBills) {
      const daysUntil = Math.ceil((bill.nextDueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const dayText = daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`;
      
      notifications.push({
        id: `bill-${bill.id}-${bill.nextDueDate.toISOString()}`,
        type: 'UPCOMING_BILL',
        title: 'Upcoming Bill',
        message: `${bill.description} is due ${dayText}.`,
        createdAt: new Date().toISOString(),
        read: false,
        actionUrl: '/dashboard/transactions',
      });
    }

    // 3. Fallback welcome message if no notifications
    if (notifications.length === 0) {
      notifications.push({
        id: `welcome-${userId}`,
        type: 'SYSTEM',
        title: 'Welcome to WealthFlow',
        message: 'Your finances are looking great! No new alerts at the moment.',
        createdAt: now.toISOString(),
        read: false,
      });
    }

    // Sort by type priority (e.g. Budget > Bills > System)
    const priority = { BUDGET_ALERT: 3, UPCOMING_BILL: 2, SYSTEM: 1 };
    notifications.sort((a, b) => priority[b.type] - priority[a.type]);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('[NOTIFICATIONS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
