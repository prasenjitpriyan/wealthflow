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
import { slideInLeft } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function RecentTransactions({
  transactions,
  currency = 'INR',
}: {
  transactions: {
    id: string;
    description: string;
    category: string;
    amount: number;
    type: string;
    date: string;
    emoji: string;
  }[];
  currency?: string;
}) {
  return (
    <Card animatedBorder className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </div>
          <Link href="/dashboard/transactions">
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((tx, i) => {
            const isIncome = tx.type === 'INCOME';
            return (
              <motion.div
                key={tx.id}
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.045 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                whileHover={{ x: 4 }}>
                <motion.div
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-base shrink-0"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                  {tx.emoji}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 h-4 font-normal">
                      {tx.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {tx.date}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    'text-sm font-semibold flex items-center gap-0.5',
                    {
                      'text-emerald-500 dark:text-emerald-400': isIncome,
                      'text-foreground': !isIncome,
                    }
                  )}>
                  {isIncome ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                  )}
                  {isIncome ? '+' : '-'}
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency,
                    maximumFractionDigits: 2,
                  }).format(Math.abs(tx.amount))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
