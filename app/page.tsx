import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AnimatedFeatures } from '@/components/landing/animated-features';
import { AnimatedPricing } from '@/components/landing/animated-pricing';
import { AnimatedStats } from '@/components/landing/animated-stats';
import { Hero3D } from '@/components/landing/hero-3d';
import { ParallaxHero } from '@/components/landing/parallax-hero';
import { SvgBackground } from '@/components/landing/svg-background';
import { LandingFooter } from '@/components/layout/landing-footer';
import { LandingNavbar } from '@/components/layout/landing-navbar';
import { getServerSession } from 'next-auth';

// ─── Hero Section ─────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Animated SVG background lines */}
      <SvgBackground />

      {/* 3D React Three Fiber Canvas */}
      <Hero3D />

      {/* Ambient glow */}
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

      {/* Parallax animated hero text (client component) */}
      <ParallaxHero />
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
      <AnimatedStats />
      <AnimatedFeatures />
      <AnimatedPricing />
      <LandingFooter />
    </div>
  );
}
