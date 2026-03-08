import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const forceRegenerate = searchParams.get('force') === 'true';

  try {
    // 1. Check for existing insight cached within the last 24 hours
    if (!forceRegenerate) {
      const existingInsight = await prisma.financialInsight.findFirst({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (existingInsight) {
        return NextResponse.json({
          insights: existingInsight.insights,
          generatedAt: existingInsight.createdAt,
          cached: true,
        });
      }
    }

    // 2. Fetch raw data to prompt the AI
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

    const [transactions, budgets, userCategoryGroup] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        include: { category: true },
        orderBy: { date: 'desc' },
      }),
      prisma.budget.findMany({
        where: { userId },
        include: { category: true },
      }),
      prisma.transaction.groupBy({
        by: ['categoryId', 'type'],
        where: {
          userId,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    // Format prompt data
    const totalIncome = userCategoryGroup
      .filter((g) => g.type === 'INCOME')
      .reduce((acc, g) => acc + Number(g._sum.amount), 0);
    const totalExpenses = userCategoryGroup
      .filter((g) => g.type === 'EXPENSE')
      .reduce((acc, g) => acc + Number(g._sum.amount), 0);

    const activeBudgets = budgets.map((b) => ({
      category: b.category.name,
      amount: Number(b.amount),
    }));

    const recentExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .slice(0, 20)
      .map((t) => ({
        date: t.date.toISOString().split('T')[0],
        category: t.category?.name || 'Uncategorized',
        amount: Number(Math.abs(Number(t.amount))),
        description: t.description,
      }));

    const promptData = {
      totalIncome,
      totalExpenses,
      savingsRate:
        totalIncome > 0
          ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
          : 0,
      activeBudgets,
      recentExpenses,
    };

    // If there is no user data, return a default insight immediately
    if (totalIncome === 0 && totalExpenses === 0 && transactions.length === 0) {
      const defaultInsight = [
        {
          type: 'suggestion',
          title: 'Welcome to WealthFlow!',
          body: 'Start adding your income and expenses to receive personalized AI financial insights and budgeting advice.',
          badge: 'Get Started',
          badgeVariant: 'secondary',
        },
      ];
      return NextResponse.json({
        insights: defaultInsight,
        generatedAt: now,
        cached: false,
      });
    }

    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // 3. Ask Gemini for insights
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert AI financial advisor integrated into a personal finance dashboard. Analyze the user's recent transactions, income, and budgets, and provide 3-4 highly specific, actionable, and personalized insights.

Output ONLY a valid JSON array of insight objects. No explanation, no markdown, no code block.

Each object MUST have this schema:
- "type": strictly one of ["warning", "positive", "suggestion"]
- "title": A short catchy title (e.g. "Food spending is high")
- "body": 2-3 sentences explaining the insight with an actionable suggestion.
- "badge": A short 1-2 word label (e.g. "Over Budget", "On Track", "Alert")
- "badgeVariant": strictly one of ["default", "secondary", "destructive"] ("destructive" for warnings, "secondary" for positive/suggestions)

Guidelines:
- Use concrete numbers and percentages from the data.
- Identify spending anomalies or budget overruns.
- Give positive reinforcement for savings rates above 20%.
- NEVER make generic statements that don't apply to the actual data.

User financial data:
${JSON.stringify(promptData)}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text
      .replace(/^```json?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();

    let parsedInsights: unknown[] = [];
    try {
      const parsed = JSON.parse(cleaned) as unknown;
      if (Array.isArray(parsed)) {
        parsedInsights = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const values = Object.values(parsed);
        parsedInsights = Array.isArray(values[0]) ? values[0] : [parsed];
      } else {
        parsedInsights = [parsed];
      }
    } catch (e) {
      console.error('Failed to parse Gemini JSON', e, cleaned);
      throw new Error('Failed to parse AI output');
    }

    // 4. Save to DB
    const savedInsight = await prisma.financialInsight.create({
      data: {
        userId,
        insights: parsedInsights as object[],
      },
    });

    return NextResponse.json({
      insights: parsedInsights,
      generatedAt: savedInsight.createdAt,
      cached: false,
    });
  } catch (error) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
