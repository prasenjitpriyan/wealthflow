import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { prisma } from '@/lib/prisma';
import { Sparkles } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { InsightsClient } from './client'; // We'll extract the client part for the regenerate button

// Define explicit types matching what OpenAI should return
interface Insight {
  type: 'warning' | 'positive' | 'suggestion';
  title: string;
  body: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'destructive';
}

async function getInsights() {
  // Use absolute URL for server-side fetching, or directly call the db
  // Usually in Next.js App Router we just hit the DB directly in Server Components
  // But since we built a nice API route with caching logic, we'll invoke the logic here directly to avoid absolute URL fetching issues on deploy

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const userId = session.user.id;

  // 1. Check for existing insight cached within the last 24 hours
  const existingInsight = await prisma.financialInsight.findFirst({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existingInsight) {
    return {
      insights: existingInsight.insights as unknown as Insight[],
      generatedAt: existingInsight.createdAt,
    };
  }

  // If no cache, return null to tell the client to fetch it via the API on load
  return null;
}

export default async function InsightsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Fetch summary data for the bottom cards
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

  const [user, categoryGroups] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { currency: true },
    }),
    prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  const currency = user?.currency || 'INR';
  const inc = Number(
    categoryGroups.find((g) => g.type === 'INCOME')?._sum.amount || 0
  );
  const exp = Number(
    categoryGroups.find((g) => g.type === 'EXPENSE')?._sum.amount || 0
  );
  const savings = inc - exp;
  const savingsRate = inc > 0 ? Math.round((savings / inc) * 100) : 0;
  const score = Math.max(0, Math.min(100, 50 + savingsRate * 1.5));

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  const summary = [
    {
      label: 'Income',
      value: formatter.format(inc),
      color: 'text-emerald-500',
    },
    { label: 'Expenses', value: formatter.format(exp), color: 'text-red-400' },
    {
      label: 'Savings',
      value: formatter.format(savings),
      color: 'text-primary',
    },
    {
      label: 'Health Score',
      value: `${Math.round(score)}/100`,
      color: 'text-amber-500',
    },
  ];

  const initialData = await getInsights();

  return (
    <div className="space-y-6 max-w-[900px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          AI Insights
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personalized financial recommendations powered by AI.
        </p>
      </div>

      <InsightsClient
        initialInsights={initialData?.insights}
        initialDate={initialData?.generatedAt}
      />

      <Separator />

      {/* Score summary */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Current Month Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {summary.map((item) => (
            <div key={item.label}>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
