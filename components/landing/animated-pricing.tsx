'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fadeUp, scaleIn, stagger } from '@/lib/animations';
import { motion, useInView } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

const freePlan = [
  'Up to 50 transactions/mo',
  'Basic analytics',
  '3 budget categories',
  'CSV export',
];

const proPlan = [
  'Unlimited transactions',
  'AI-powered insights',
  'Unlimited budgets',
  'Recurring automation',
  'Multi-currency',
  'Priority support',
];

export function AnimatedPricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const container = stagger(0.1, 0.15);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={stagger(0.05, 0.1)}>
          <motion.div variants={fadeUp}>
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary border-primary/20">
              Pricing
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            variants={fadeUp}>
            Simple, transparent pricing
          </motion.h2>
          <motion.p className="text-muted-foreground" variants={fadeUp}>
            Start free. Upgrade when you&apos;re ready.
          </motion.p>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={container}>
          {/* Free plan */}
          <motion.div
            className="p-8 rounded-2xl border border-border/50 bg-card/40"
            variants={scaleIn}
            whileHover={{
              y: -6,
              boxShadow: '0 20px 40px -12px rgba(0,0,0,0.3)',
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Free
            </p>
            <p className="text-4xl font-extrabold mb-1">₹0</p>
            <p className="text-sm text-muted-foreground mb-6">Forever free</p>
            <ul className="space-y-2.5 mb-8">
              {freePlan.map((f, i) => (
                <motion.li
                  key={f}
                  className="flex items-center gap-2 text-sm"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.07 }}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Get started
              </Button>
            </Link>
          </motion.div>

          {/* Pro plan */}
          <motion.div
            className="relative p-8 rounded-2xl border border-primary/40 bg-primary/5 overflow-hidden"
            variants={scaleIn}
            whileHover={{
              y: -6,
              boxShadow: '0 24px 50px -12px rgba(99,102,241,0.35)',
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
            {/* Animated shimmer stripe */}
            <motion.div
              className="absolute inset-0 -z-10 opacity-20"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(99,102,241,0.5) 50%, transparent 60%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: 2,
              }}
            />

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-primary/15 rounded-full blur-2xl -z-10" />
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-primary">Pro</p>
              <Badge className="text-xs bg-primary text-primary-foreground">
                Most popular
              </Badge>
            </div>
            <p className="text-4xl font-extrabold mb-1">
              ₹99
              <span className="text-lg font-medium text-muted-foreground">
                /mo
              </span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Billed annually
            </p>
            <ul className="space-y-2.5 mb-8">
              {proPlan.map((f, i) => (
                <motion.li
                  key={f}
                  className="flex items-center gap-2 text-sm"
                  initial={{ opacity: 0, x: -16 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07 }}>
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </motion.li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button className="w-full shadow-lg shadow-primary/25">
                Start free trial
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
