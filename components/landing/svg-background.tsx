'use client';

import { motion } from 'framer-motion';

export function SvgBackground() {
  const paths = [
    'M-100,200 C100,100 300,300 500,150 S800,50 1100,200 S1400,350 1600,200',
    'M-100,350 C150,250 350,450 600,300 S900,150 1200,320 S1500,480 1700,320',
    'M-100,500 C200,400 400,600 700,450 S1000,280 1300,460 S1550,600 1800,430',
  ];

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.06]"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="svgGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="40%" stopColor="#8b5cf6" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="svgGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>

        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={i % 2 === 0 ? 'url(#svgGrad1)' : 'url(#svgGrad2)'}
            strokeWidth={i === 1 ? 2 : 1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0.7, 1] }}
            transition={{
              pathLength: {
                duration: 3 + i * 0.5,
                ease: 'easeInOut',
                delay: i * 0.4,
              },
              opacity: {
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.6,
              },
            }}
          />
        ))}

        {/* Floating dots */}
        {[
          { cx: 200, cy: 150 },
          { cx: 600, cy: 80 },
          { cx: 1000, cy: 200 },
          { cx: 1300, cy: 100 },
          { cx: 400, cy: 320 },
          { cx: 850, cy: 380 },
        ].map((dot, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={dot.cx}
            cy={dot.cy}
            r={2.5}
            fill="#6366f1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}
