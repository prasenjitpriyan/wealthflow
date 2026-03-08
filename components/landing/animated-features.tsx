'use client';

import { Badge } from '@/components/ui/badge';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BarChart3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track income and expenses with live dashboards, area charts, and category breakdowns updated instantly.',
    color: 'text-primary bg-primary/10',
    iconColor: '#6366f1',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    desc: 'Get personalized recommendations based on your spending patterns, savings rate, and financial health score.',
    color: 'text-violet-400 bg-violet-400/10',
    iconColor: '#8b5cf6',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Automation',
    desc: 'Set up recurring transactions once and let WealthFlow automatically track subscriptions, bills, and salary.',
    color: 'text-emerald-400 bg-emerald-400/10',
    iconColor: '#10b981',
  },
  {
    icon: ShieldCheck,
    title: 'Budget Alerts',
    desc: 'Create category budgets with custom limits. Get notified before you overspend and stay on track every month.',
    color: 'text-amber-400 bg-amber-400/10',
    iconColor: '#f59e0b',
  },
  {
    icon: Zap,
    title: 'Multi-Currency',
    desc: 'Manage accounts in multiple currencies with automatic conversion and real-time exchange rate tracking.',
    color: 'text-cyan-400 bg-cyan-400/10',
    iconColor: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Financial Health Score',
    desc: 'Your personal finance score — updated monthly based on savings rate, budget adherence, and emergency fund.',
    color: 'text-rose-400 bg-rose-400/10',
    iconColor: '#f43f5e',
  },
];

export function AnimatedFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Section header reveal
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Cards stagger
      const cards = cardsRef.current?.querySelectorAll('.feature-card');
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 48,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section id="features" ref={sectionRef} className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20">
            Everything you need
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built for serious financial clarity
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            From daily expense tracking to AI-generated monthly reports —
            WealthFlow covers every layer of your financial life.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <motion.div
              key={f.title}
              className="feature-card group p-6 rounded-2xl border border-border/50 bg-card/40 hover:border-primary/20 hover:bg-card/70 transition-colors duration-200 cursor-default"
              whileHover={{
                y: -6,
                boxShadow: `0 20px 40px -12px ${f.iconColor}30`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}
                whileHover={{
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.4 },
                }}>
                <f.icon className="w-5 h-5" />
              </motion.div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>

              {/* Hover border glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${f.iconColor}40` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
