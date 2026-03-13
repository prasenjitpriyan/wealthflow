'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Logo({ className, ...props }: React.ComponentPropsWithoutRef<typeof motion.svg>) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-6 h-6 shrink-0 text-primary", className)}
      {...props}
    >
      <defs>
        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" className="[stop-color:currentColor]" />
          <stop offset="100%" className="[stop-color:currentColor] [stop-opacity:0.5]" />
        </linearGradient>
      </defs>
      <motion.path
        d="M4 14L9 8L15 16L20 9"
        stroke="url(#flow-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="20"
        cy="9"
        r="2"
        className="fill-primary"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4, type: 'spring' }}
      />
      <motion.path
        d="M4 14L9 8L15 16L20 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="blur-[6px] opacity-30"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
