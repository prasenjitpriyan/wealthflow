import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wealthflow.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'WealthFlow — AI-Powered Personal Finance',
    template: '%s | WealthFlow',
  },
  description:
    'Track income & expenses, manage recurring budgets, visualize financial data, and get AI-powered spending insights — all in one beautifully designed dashboard.',
  keywords: [
    'personal finance',
    'budget tracker',
    'expense tracker',
    'AI finance',
    'spending insights',
    'financial dashboard',
    'money management',
  ],
  authors: [{ name: 'WealthFlow' }],
  creator: 'WealthFlow',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'WealthFlow',
    title: 'WealthFlow — AI-Powered Personal Finance',
    description:
      'Track income & expenses, manage recurring budgets, visualize financial data, and get AI-powered spending insights — all in one beautifully designed dashboard.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WealthFlow — AI-Powered Personal Finance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WealthFlow — AI-Powered Personal Finance',
    description:
      'Track income & expenses, manage budgets, and get AI-powered spending insights.',
    images: ['/og-image.png'],
    creator: '@wealthflow',
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
