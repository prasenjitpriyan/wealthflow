'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const insights = [
  {
    type: 'warning',
    title: 'Food spending is 17% over budget',
    body: "You've spent $820 on food this month against a $700 budget. Try meal prepping to reduce dining-out costs.",
    icon: TrendingDown,
    badge: 'Over Budget',
    badgeVariant: 'destructive' as const,
  },
  {
    type: 'positive',
    title: 'Great savings rate this month!',
    body: 'You saved 41% of your income in February — significantly above the recommended 20%. Keep it up!',
    icon: CheckCircle2,
    badge: 'Positive',
    badgeVariant: 'secondary' as const,
  },
  {
    type: 'suggestion',
    title: 'Consider investing your excess savings',
    body: 'You have $3,369 in net savings this month. At your current rate, investing $2,000/month in an index fund could grow to $480K in 15 years.',
    icon: Lightbulb,
    badge: 'Suggestion',
    badgeVariant: 'secondary' as const,
  },
  {
    type: 'warning',
    title: 'Shopping spike vs last month',
    body: 'Shopping expenses rose 38% compared to last month ($464 → $640). This may push you over your monthly budget.',
    icon: AlertCircle,
    badge: 'Alert',
    badgeVariant: 'destructive' as const,
  },
  {
    type: 'positive',
    title: 'Transport costs under control',
    body: "Transport is $10 under budget at $390 vs $400. Small wins add up — you're on track!",
    icon: TrendingUp,
    badge: 'On Track',
    badgeVariant: 'secondary' as const,
  },
];

const iconStyles: Record<string, string> = {
  warning: 'text-amber-500 bg-amber-500/10',
  positive: 'text-emerald-500 bg-emerald-500/10',
  suggestion: 'text-primary bg-primary/10',
};

export default function InsightsPage() {
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

      {/* AI Generation Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Analysis Complete</p>
              <p className="text-xs text-muted-foreground">
                Based on 3 months of transaction history • Updated Mar 2, 2026
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border-primary/30">
            Regenerate insights
          </Button>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <Card
            key={i}
            className="border-border/50 hover:border-primary/20 transition-colors group">
            <CardContent className="py-4 flex gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[insight.type]}`}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{insight.title}</p>
                  <Badge
                    variant={insight.badgeVariant}
                    className="text-xs shrink-0">
                    {insight.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {insight.body}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Score summary */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Monthly Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Income', value: '$8,200', color: 'text-emerald-500' },
            { label: 'Expenses', value: '$4,830', color: 'text-red-400' },
            { label: 'Savings', value: '$3,370', color: 'text-primary' },
            { label: 'Health Score', value: '78/100', color: 'text-amber-500' },
          ].map((item) => (
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
