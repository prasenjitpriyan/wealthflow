'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fadeUp, stagger } from '@/lib/animations';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { AlertTriangle, Loader2, PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Budget {
  id: string;
  amount: number;
  spent: number;
  period: string;
  alertAt: number;
  category: { name: string; icon: string; color: string } | null;
}

const defaultForm = {
  categoryId: '',
  amount: '',
  period: 'MONTHLY' as const,
  startDate: new Date().toISOString().slice(0, 10),
  alertAt: 80,
};

function AnimatedBudgetCard({
  budget,
  pct,
  isOver,
  remaining,
  currency,
  onDelete,
}: {
  budget: Budget;
  pct: number;
  isOver: boolean;
  remaining: number;
  currency?: string;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  const barColor = isOver
    ? 'bg-destructive'
    : pct >= 80
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      className="p-4 rounded-xl border border-border/50 hover:border-primary/20 transition-colors bg-card group relative"
      whileHover={{ y: -4, boxShadow: '0 12px 28px -8px rgba(0,0,0,0.25)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
      <motion.button
        onClick={() => onDelete(budget.id)}
        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{ scale: 1.15, rotate: 8 }}>
        <Trash2 className="w-3.5 h-3.5" />
      </motion.button>

      <div className="flex items-center justify-between mb-3 pr-5">
        <div className="flex items-center gap-2.5">
          <motion.span
            className="text-xl"
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
            {budget.category?.icon ?? '📁'}
          </motion.span>
          <div>
            <p className="text-sm font-semibold">
              {budget.category?.name ?? 'Budget'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatCurrency(budget.spent, currency)} of{' '}
              {formatCurrency(budget.amount, currency)}
            </p>
          </div>
        </div>
        <Badge
          variant={isOver ? 'destructive' : 'secondary'}
          className={cn('text-xs', {
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0':
              !isOver && pct < 80,
            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0':
              !isOver && pct >= 80,
          })}>
          {isOver
            ? `${formatCurrency(Math.abs(remaining), currency)} over`
            : `${formatCurrency(remaining, currency)} left`}
        </Badge>
      </div>

      {/* Animated progress bar */}
      <div className="relative">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${pct}%` } : { width: 0 }}
            transition={{
              duration: 1.1,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.15,
            }}
          />
        </div>
        <div className="absolute right-0 -top-5 text-[10px] text-muted-foreground">
          {pct.toFixed(0)}%
        </div>
      </div>
    </motion.div>
  );
}

export function BudgetsList() {
  const { data: session } = useSession();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  async function fetchData() {
    const [bRes, cRes] = await Promise.all([
      fetch('/api/budgets'),
      fetch('/api/categories'),
    ]);
    const bData = await bRes.json();
    const cData = await cRes.json();
    setBudgets(bData.budgets ?? []);
    setCategories(cData.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const [bRes, cRes] = await Promise.all([
        fetch('/api/budgets'),
        fetch('/api/categories'),
      ]);
      const bData = await bRes.json();
      const cData = await cRes.json();
      setBudgets(bData.budgets ?? []);
      setCategories(cData.categories ?? []);
      setLoading(false);
    })();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: parseFloat(form.amount) }),
    });
    setOpen(false);
    setSaving(false);
    setForm(defaultForm);
    fetchData();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
    fetchData();
  }

  const totalBudgeted = budgets.reduce((a, b) => a + b.amount, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);
  const overBudget = budgets.filter((b) => b.spent > b.amount);

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate="visible">
        {[
          {
            label: 'Total Budgeted',
            value: formatCurrency(totalBudgeted, session?.user?.currency),
            cls: '',
          },
          {
            label: 'Total Spent',
            value: formatCurrency(totalSpent, session?.user?.currency),
            cls: totalSpent > totalBudgeted ? 'text-red-500' : '',
          },
          {
            label: 'Remaining',
            value: `${formatCurrency(Math.abs(totalBudgeted - totalSpent), session?.user?.currency)}${totalBudgeted - totalSpent < 0 ? ' over' : ''}`,
            cls:
              totalBudgeted - totalSpent < 0
                ? 'text-red-500'
                : 'text-emerald-500',
          },
        ].map((item) => (
          <motion.div key={item.label} variants={fadeUp}>
            <Card className="border-border/50">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={cn('text-2xl font-bold mt-1', item.cls)}>
                  {item.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Over-budget alert */}
      {overBudget.length > 0 && (
        <motion.div
          className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}>
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {overBudget.length} budget{overBudget.length > 1 ? 's are' : ' is'}{' '}
            over limit:{' '}
            {overBudget.map((b) => b.category?.name ?? 'Unknown').join(', ')}
          </span>
        </motion.div>
      )}

      {/* Budgets Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Monthly Budgets
            </CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> New Budget
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs">
                <DialogHeader>
                  <DialogTitle>Create Budget</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-3 mt-2">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={form.categoryId}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, categoryId: v }))
                      }>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Amount ({session?.user?.currency || 'INR'})</Label>
                      <Input
                        className="h-8"
                        type="number"
                        min="1"
                        step="1"
                        value={form.amount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, amount: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Period</Label>
                      <Select
                        value={form.period}
                        onValueChange={(v) =>
                          setForm((f) => ({
                            ...f,
                            period: v as typeof form.period,
                          }))
                        }>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Alert at (%)</Label>
                    <Input
                      className="h-8"
                      type="number"
                      min="1"
                      max="100"
                      value={form.alertAt}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          alertAt: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-8 text-xs"
                    disabled={saving || !form.categoryId}>
                    {saving && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    )}
                    Create Budget
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <PiggyBank className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No budgets yet. Create your first budget!
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger(0, 0.08)}
              initial="hidden"
              animate="visible">
              {budgets.map((budget) => {
                const pct =
                  budget.amount > 0
                    ? Math.min((budget.spent / budget.amount) * 100, 100)
                    : 0;
                const isOver = budget.spent > budget.amount;
                const remaining = budget.amount - budget.spent;
                return (
                  <AnimatedBudgetCard
                    key={budget.id}
                    budget={budget}
                    pct={pct}
                    isOver={isOver}
                    remaining={remaining}
                    currency={session?.user?.currency}
                    onDelete={handleDelete}
                  />
                );
              })}
            </motion.div>
          )}
        </CardContent>
      </Card>

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
