import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { LandingFooter } from '@/components/layout/landing-footer';
import { LandingNavbar } from '@/components/layout/landing-navbar';
import { Badge } from '@/components/ui/badge';
import { Play, Sparkles } from 'lucide-react';
import { getServerSession } from 'next-auth';

export default async function DemoPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar session={session} />

      <main className="flex-1 w-full pt-32 pb-16 flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient glow background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[200px] bg-violet-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 gap-2">
              <Sparkles className="w-3 h-3" />
              Interactive Demo
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            See WealthFlow in Action
          </h1>
          <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto">
            Take a closer look at how our AI-powered features, smart budgeting,
            and analytics come together to simplify your financial life.
          </p>
        </div>

        {/* Video Player Placeholder */}
        <div className="w-full max-w-5xl relative group z-10 cursor-pointer">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 rounded-3xl z-10" />

          {/* Player controls overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl shadow-primary/50 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            </div>
            <p className="mt-6 text-white font-medium text-lg drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
              Coming Soon
            </p>
          </div>

          {/* Browser mockup frame */}
          <div className="relative rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video">
            <div className="absolute top-0 inset-x-0 h-12 border-b border-white/10 bg-black/20 flex items-center px-4 gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>

            {/* Dark background pattern */}
            <div
              className="absolute inset-0 mt-12 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0v40M40 0v40M0 0h40M0 40h40' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Simulated UI elements (blurred out to look like a screen behind the play button) */}
            <div className="absolute inset-0 mt-12 p-8 blur-[2px] opacity-40">
              <div className="flex gap-6 h-full">
                <div className="w-64 bg-muted/30 rounded-xl h-full" />
                <div className="flex-1 flex flex-col gap-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="h-32 bg-muted/40 rounded-xl" />
                    <div className="h-32 bg-muted/40 rounded-xl" />
                    <div className="h-32 bg-muted/40 rounded-xl" />
                  </div>
                  <div className="flex-1 bg-muted/20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
