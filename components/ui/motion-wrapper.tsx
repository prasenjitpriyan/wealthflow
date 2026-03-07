'use client';

import { motion } from 'framer-motion';

export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function FloatIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function FloatAnimation({
  children,
  yOffset = 15,
  duration = 3,
  className,
}: {
  children: React.ReactNode;
  yOffset?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ y: [0, -yOffset, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={className}>
      {children}
    </motion.div>
  );
}
