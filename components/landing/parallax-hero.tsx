'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fadeUp, stagger } from '@/lib/animations';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const container = stagger(0.05, 0.12);

  return (
    <motion.div
      ref={ref}
      className="max-w-4xl mx-auto px-4 sm:px-6 text-center"
      style={{ y, opacity }}
      variants={container}
      initial="hidden"
      animate="visible">
      {/* Badge */}
      <motion.div className="flex justify-center mb-6" variants={fadeUp}>
        <Badge
          variant="secondary"
          className="px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 gap-2">
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
            <Sparkles className="w-3 h-3" />
          </motion.span>
          AI-Powered Personal Finance
        </Badge>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
        variants={fadeUp}>
        Your finances,{' '}
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-violet-400 to-indigo-400">
            intelligently
          </span>
          {/* Underline SVG animation */}
          <motion.svg
            viewBox="0 0 300 12"
            className="absolute -bottom-2 left-0 w-full h-3 overflow-visible"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}>
            <motion.path
              d="M0,6 Q75,0 150,6 Q225,12 300,6"
              fill="none"
              stroke="url(#underlineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient
                id="underlineGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </motion.svg>
        </span>{' '}
        managed.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        variants={fadeUp}>
        WealthFlow gives you real-time visibility into your spending, automates
        recurring budgets, and delivers AI-powered insights — so you can build
        wealth with confidence.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
        variants={fadeUp}>
        <Link href="/dashboard">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="lg"
              className="px-8 h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </Link>
        <Link href="/demo">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 text-base border-border/60 hover:bg-muted/50">
              View demo
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      {/* Social proof */}
      <motion.p
        className="text-xs text-muted-foreground mt-6"
        variants={fadeUp}>
        No credit card required · Free forever plan · Cancel anytime
      </motion.p>
    </motion.div>
  );
}
