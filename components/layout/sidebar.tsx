'use client';

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Sparkles,
  Tag,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/logo';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    title: 'Transactions',
    href: '/dashboard/transactions',
    icon: ArrowRightLeft,
  },
  { title: 'Budgets', href: '/dashboard/budgets', icon: PiggyBank },
  { title: 'Categories', href: '/dashboard/categories', icon: Tag },
  { title: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { title: 'AI Insights', href: '/dashboard/insights', icon: Sparkles },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <motion.div
        className="flex items-center justify-between px-4 py-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <motion.div
            className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shrink-0"
            whileHover={{ scale: 1.08, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Logo className="w-full h-full p-1" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">
            Wealth<span className="text-primary">Flow</span>
          </span>
        </Link>
      </motion.div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        <motion.p
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}>
          Main Menu
        </motion.p>
        {navItems.map((item, i) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.08 + i * 0.055,
                duration: 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}>
              <Link href={item.href}>
                <motion.div
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer overflow-hidden',
                    isActive
                      ? 'text-primary-foreground'
                      : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
                  )}
                  whileHover={!isActive ? { x: 4 } : {}}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}>
                  {/* Active background with layout animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary rounded-lg shadow-sm shadow-primary/30"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Hover background */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-sidebar-accent opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  <item.icon
                    className={cn(
                      'w-4 h-4 shrink-0 relative z-10',
                      isActive && 'text-primary-foreground'
                    )}
                  />
                  <span className="relative z-10">{item.title}</span>
                  {item.title === 'AI Insights' && (
                    <motion.span
                      className="relative z-10 ml-auto text-[10px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded-full"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      AI
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Settings */}
      <div className="px-3 py-4">
        <Link href="/dashboard/settings">
          <motion.div
            className={cn(
              'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer overflow-hidden',
              pathname === '/dashboard/settings'
                ? 'text-primary-foreground'
                : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
            )}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}>
            {pathname === '/dashboard/settings' && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-primary rounded-lg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Settings className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Settings</span>
          </motion.div>
        </Link>
      </div>
    </aside>
  );
}
