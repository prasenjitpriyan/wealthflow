import type { Variants } from 'framer-motion';

// ── Easing ────────────────────────────────────────────────────────────────────
export const ease = {
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  spring: { type: 'spring', stiffness: 260, damping: 20 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
};

// ── Variants ──────────────────────────────────────────────────────────────────
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: ease.smooth },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: ease.smooth } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: ease.smooth },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: ease.smooth },
  },
};

export const stagger = (
  delayIncrement = 0.08,
  staggerChildren = 0.08
): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren: delayIncrement,
    },
  },
});
