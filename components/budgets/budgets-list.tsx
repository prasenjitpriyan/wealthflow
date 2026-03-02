'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AlertTriangle, PiggyBank, Plus } from 'lucide-react';

const budgets = [
  {
    name: 'Housing',
    emoji: '🏠',
    budgeted: 1600,
    spent: 1500,
    color: 'var(--chart-1)',
  },
  {
    name: 'Food & Dining',
    emoji: '🍔',
    budgeted: 700,
    spent: 820,
    color: 'var(--chart-5)',
  },
  {
    name: 'Transport',
    emoji: '🚗',
    budgeted: 400,
    spent: 390,
    color: 'var(--chart-3)',
  },
  {
    name: 'Shopping',
    emoji: '🛍️',
    budgeted: 500,
    spent: 640,
    color: 'var(--chart-5)',
  },
  {
    name: 'Health',
    emoji: '💊',
    budgeted: 350,
    spent: 280,
    color: 'var(--chart-2)',
  },
  {
    name: 'Entertainment',
    emoji: '🎮',
    budgeted: 150,
    spent: 26,
    color: 'var(--chart-4)',
  },
];

export function BudgetsList() {
  const totalBudgeted = budgets.reduce((a, b) => a + b.budgeted, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const overBudget = budgets.filter((b) => b.spent > b.budgeted);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">Total Budgeted</p>
            <p className="text-2xl font-bold mt-1">
              ${totalBudgeted.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p
              className={cn(
                'text-2xl font-bold mt-1',
                totalSpent > totalBudgeted ? 'text-red-500' : 'text-foreground'
              )}>
              ${totalSpent.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p
              className={cn(
                'text-2xl font-bold mt-1',
                totalBudgeted - totalSpent < 0
                  ? 'text-red-500'
                  : 'text-emerald-500'
              )}>
              ${Math.abs(totalBudgeted - totalSpent).toLocaleString()}
              {totalBudgeted - totalSpent < 0 && ' over'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert for over-budget */}
      {overBudget.length > 0 && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {overBudget.length} budget{overBudget.length > 1 ? 's are' : ' is'}{' '}
            over limit: {overBudget.map((b) => b.name).join(', ')}
          </span>
        </div>
      )}

      {/* Budgets Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Monthly Budgets
            </CardTitle>
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> New Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgets.map((budget) => {
              const pct = Math.min((budget.spent / budget.budgeted) * 100, 100);
              const isOver = budget.spent > budget.budgeted;
              const remaining = budget.budgeted - budget.spent;

              return (
                <div
                  key={budget.name}
                  className="p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-colors bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{budget.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold">{budget.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ${budget.spent.toLocaleString()} of $
                          {budget.budgeted.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        isOver
                          ? 'destructive'
                          : pct >= 80
                            ? 'secondary'
                            : 'secondary'
                      }
                      className={cn('text-xs', {
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0':
                          !isOver && pct < 80,
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0':
                          !isOver && pct >= 80,
                      })}>
                      {isOver
                        ? `$${Math.abs(remaining)} over`
                        : `$${remaining} left`}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Progress
                      value={pct}
                      className={cn('h-2', isOver && '[&>div]:bg-destructive')}
                    />
                    <div className="absolute right-0 -top-5 text-[10px] text-muted-foreground">
                      {pct.toFixed(0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Empty state hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-3">
        <PiggyBank className="w-4 h-4 shrink-0" />
        <span>
          Tip: Set budgets per category to get automatic alerts when you&apos;re
          close to your limit.
        </span>
      </div>
    </div>
  );
}
