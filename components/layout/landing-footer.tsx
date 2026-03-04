import Image from 'next/image';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t border-border/30 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="WealthFlow"
              width={24}
              height={24}
              className="object-cover"
            />
          </div>
          <span className="text-sm font-semibold">
            Wealth<span className="text-primary">Flow</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} WealthFlow. Built with ❤️ for your
          financial future.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
