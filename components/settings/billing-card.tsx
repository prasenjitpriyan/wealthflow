'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  ArrowUpCircle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Infinity as InfinityIcon,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BillingStatus {
  plan: 'FREE' | 'PRO';
  planSince: string | null;
  limits: {
    maxTransactionsPerMonth: number;
    maxCategories: number;
    maxBudgets: number;
  };
  usage: {
    transactionsThisMonth: number;
    categories: number;
    budgets: number;
  };
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

const PRO_FEATURES = [
  'Unlimited transactions',
  'AI-powered insights',
  'Unlimited budgets & categories',
  'Recurring automation',
  'Multi-currency support',
  'Priority support',
];

const FREE_FEATURES = [
  'Up to 50 transactions/mo',
  'Basic analytics',
  '3 budget categories',
  'CSV export',
];

export function BillingCard() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [downgrading, setDowngrading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/billing/status');
      if (res.ok) setStatus(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      // 1. Create Razorpay order
      const res = await fetch('/api/billing/create-order', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to create order');
      const { orderId, amount, currency, keyId } = await res.json();

      // 2. Open Razorpay checkout modal
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency,
          name: 'WealthFlow',
          description: 'Pro Plan – ₹99/mo',
          order_id: orderId,
          theme: { color: '#6366f1' },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // 3. Verify payment on backend
              const verifyRes = await fetch('/api/billing/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });
              if (!verifyRes.ok) throw new Error('Verification failed');
              toast.success('🎉 Welcome to Pro! Your plan has been upgraded.');
              await fetchStatus();
              resolve();
            } catch {
              reject(new Error('Payment verification failed'));
            }
          },
          modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg !== 'Payment cancelled') toast.error(msg);
    } finally {
      setUpgrading(false);
    }
  }

  async function handleDowngrade() {
    setDowngrading(true);
    try {
      const res = await fetch('/api/billing/downgrade', { method: 'POST' });
      if (!res.ok) throw new Error('Downgrade failed');
      toast.success('Downgraded to Free plan.');
      await fetchStatus();
    } catch {
      toast.error('Failed to downgrade. Please try again.');
    } finally {
      setDowngrading(false);
    }
  }

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!status) return null;

  const { plan, planSince, limits, usage } = status;
  const isPro = plan === 'PRO';
  const txPct = isPro
    ? 100
    : Math.min((usage.transactionsThisMonth / limits.maxTransactionsPerMonth) * 100, 100);
  const catPct = isPro
    ? 100
    : Math.min((usage.categories / limits.maxCategories) * 100, 100);

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Billing & Plan</CardTitle>
          </div>
          <Badge
            className={
              isPro
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }>
            {isPro ? '✦ Pro' : 'Free'}
          </Badge>
        </div>
        <CardDescription>
          {isPro && planSince
            ? `Pro since ${new Date(planSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : 'Upgrade to Pro for unlimited access.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage meters */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Usage this month
          </p>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Transactions</span>
              <span className="text-muted-foreground">
                {usage.transactionsThisMonth}
                {isPro ? (
                  <InfinityIcon className="inline w-3 h-3 ml-1" />
                ) : (
                  ` / ${limits.maxTransactionsPerMonth}`
                )}
              </span>
            </div>
            <Progress value={txPct} className="h-1.5" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Categories</span>
              <span className="text-muted-foreground">
                {usage.categories}
                {isPro ? (
                  <InfinityIcon className="inline w-3 h-3 ml-1" />
                ) : (
                  ` / ${limits.maxCategories}`
                )}
              </span>
            </div>
            <Progress value={catPct} className="h-1.5" />
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isPro ? 'Your Pro features' : 'What you get with Pro'}
          </p>
          {isPro ? (
            <ul className="space-y-1.5">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Current (Free)</p>
                <ul className="space-y-1.5">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-primary mb-1.5">Unlock with Pro</p>
                <ul className="space-y-1.5">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {isPro ? (
          <div className="flex items-center gap-3">
            <motion.div
              className="flex-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-center font-medium"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 3, repeat: Infinity }}>
              ✦ Pro Plan Active – ₹99/mo
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground shrink-0"
              onClick={handleDowngrade}
              disabled={downgrading}>
              {downgrading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span className="ml-1 text-xs">Downgrade</span>
            </Button>
          </div>
        ) : (
          <motion.div
            className="relative rounded-xl border border-primary/40 bg-primary/5 p-4 overflow-hidden"
            whileHover={{ scale: 1.01 }}>
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 -z-10 opacity-20"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.5) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
            />
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-sm">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground">
                  ₹99/mo · Cancel anytime
                </p>
              </div>
              <Badge className="bg-primary text-primary-foreground text-xs">
                Most popular
              </Badge>
            </div>
            <Button
              className="w-full shadow-lg shadow-primary/25 gap-2"
              onClick={handleUpgrade}
              disabled={upgrading}>
              {upgrading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUpCircle className="w-4 h-4" />
              )}
              {upgrading ? 'Opening Payment...' : 'Upgrade to Pro — ₹99/mo'}
            </Button>
          </motion.div>
        )}

        {/* Free plan note */}
        {!isPro && (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <X className="w-3 h-3" />
            You are on the Free plan. Some features are restricted.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
