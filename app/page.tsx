import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LandingFooter } from '@/components/layout/landing-footer';
import { LandingNavbar } from '@/components/layout/landing-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

// ─── Hero Section ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Ambient glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0v40M40 0v40M0 0h40M0 40h40' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 gap-2">
            <Sparkles className="w-3 h-3" />
            AI-Powered Personal Finance
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Your finances,{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-violet-400 to-indigo-400">
              intelligently
            </span>
          </span>{' '}
          managed.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          WealthFlow gives you real-time visibility into your spending,
          automates recurring budgets, and delivers AI-powered insights — so you
          can build wealth with confidence.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 h-12 text-base font-semibold gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
              Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 text-base border-border/60 hover:bg-muted/50">
              View demo
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-xs text-muted-foreground mt-6">
          No credit card required · Free forever plan · Cancel anytime
        </p>

        {/* Dashboard preview mockup */}
        <div id="preview" className="mt-16 relative scroll-mt-24">
          <div className="relative rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4">
                <div className="bg-muted/30 rounded-md h-5 w-56 mx-auto flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">
                    app.wealthflow.ai/dashboard
                  </span>
                </div>
              </div>
            </div>
            {/* Stats preview inside mockup */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  {
                    label: 'Total Balance',
                    value: '₹24,563',
                    color: 'text-foreground',
                  },
                  {
                    label: 'Monthly Income',
                    value: '₹8,200',
                    color: 'text-emerald-400',
                  },
                  { label: 'Expenses', value: '₹4,830', color: 'text-red-400' },
                  {
                    label: 'Net Savings',
                    value: '₹3,369',
                    color: 'text-primary',
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-muted/30 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {s.label}
                    </p>
                    <p className={`text-base font-bold ${s.color}`}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              {/* Fake chart bars */}
              <div className="bg-muted/20 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  Cash Flow Overview
                </p>
                <div className="flex items-end gap-2 h-20">
                  {[65, 80, 72, 90, 78, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-sm bg-linear-to-t from-primary/60 to-primary/20"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-[9px] text-muted-foreground">
                        {['S', 'O', 'N', 'D', 'J', 'F'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 blur-2xl -z-10 rounded-full" />
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Track income and expenses with live dashboards, area charts, and category breakdowns updated instantly.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    desc: 'Get personalized recommendations based on your spending patterns, savings rate, and financial health score.',
    color: 'text-violet-400 bg-violet-400/10',
  },
  {
    icon: RefreshCw,
    title: 'Recurring Automation',
    desc: 'Set up recurring transactions once and let WealthFlow automatically track subscriptions, bills, and salary.',
    color: 'text-emerald-400 bg-emerald-400/10',
  },
  {
    icon: ShieldCheck,
    title: 'Budget Alerts',
    desc: 'Create category budgets with custom limits. Get notified before you overspend and stay on track every month.',
    color: 'text-amber-400 bg-amber-400/10',
  },
  {
    icon: Zap,
    title: 'Multi-Currency',
    desc: 'Manage accounts in multiple currencies with automatic conversion and real-time exchange rate tracking.',
    color: 'text-cyan-400 bg-cyan-400/10',
  },
  {
    icon: TrendingUp,
    title: 'Financial Health Score',
    desc: 'Your personal finance score — updated monthly based on savings rate, budget adherence, and emergency fund.',
    color: 'text-rose-400 bg-rose-400/10',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
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

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-border/50 bg-card/40 hover:border-primary/20 hover:bg-card/70 transition-all duration-200">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Social Proof / Numbers ───────────────────────────────────────────────────

function Stats() {
  return (
    <section className="py-16 px-4 sm:px-6 border-y border-border/30">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {[
          { value: '12K+', label: 'Active users' },
          { value: '₹2.4M', label: 'Tracked monthly' },
          { value: '98%', label: 'Satisfaction rate' },
          { value: '4.9★', label: 'Average rating' },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-violet-400">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────────────

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <Badge
            variant="secondary"
            className="mb-4 bg-primary/10 text-primary border-primary/20">
            Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Free plan */}
          <div className="p-8 rounded-2xl border border-border/50 bg-card/40">
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Free
            </p>
            <p className="text-4xl font-extrabold mb-1">₹0</p>
            <p className="text-sm text-muted-foreground mb-6">Forever free</p>
            <ul className="space-y-2.5 mb-8">
              {[
                'Up to 50 transactions/mo',
                'Basic analytics',
                '3 budget categories',
                'CSV export',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Get started
              </Button>
            </Link>
          </div>

          {/* Pro plan */}
          <div className="relative p-8 rounded-2xl border border-primary/40 bg-primary/5 overflow-hidden">
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
              {[
                'Unlimited transactions',
                'AI-powered insights',
                'Unlimited budgets',
                'Recurring automation',
                'Multi-currency',
                'Priority support',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard">
              <Button className="w-full shadow-lg shadow-primary/25">
                Start free trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar session={session} />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <LandingFooter />
    </div>
  );
}
