'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 12000, suffix: '+', label: 'Active users', display: '12K+' },
  {
    value: 2.4,
    suffix: 'M',
    label: 'Tracked monthly',
    prefix: '₹',
    display: '₹2.4M',
  },
  { value: 98, suffix: '%', label: 'Satisfaction rate', display: '98%' },
  { value: 4.9, suffix: '★', label: 'Average rating', display: '4.9★' },
];

export function AnimatedStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useGSAP(
    () => {
      const items = sectionRef.current?.querySelectorAll('.stat-item');
      if (!items) return;

      gsap.from(items, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Counter animations
      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        const stat = stats[i];
        const isDecimal = stat.value % 1 !== 0;

        gsap.from(
          { val: 0 },
          {
            val: stat.value,
            duration: 1.8,
            ease: 'power2.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
            onUpdate() {
              if (!el) return;
              const current = this.targets()[0] as { val: number };
              const formatted = isDecimal
                ? current.val.toFixed(1)
                : Math.round(current.val).toLocaleString();
              el.textContent = `${stat.prefix ?? ''}${formatted}${stat.suffix}`;
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 border-y border-border/30">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={stat.label} className="stat-item">
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-violet-400">
              <span
                ref={(el) => {
                  numbersRef.current[i] = el;
                }}
                data-target={stat.value}>
                {stat.display}
              </span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
