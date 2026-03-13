import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Session } from 'next-auth';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export function LandingNavbar({ session }: { session: Session | null }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
            <Logo className="w-full h-full p-1" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Wealth<span className="text-primary">Flow</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/#features"
            className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link
            href="/demo"
            className="hover:text-foreground transition-colors">
            Demo
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Dashboard
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button size="sm" variant="outline" className="gap-1.5">
                  Sign out
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5">
                  Get started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
