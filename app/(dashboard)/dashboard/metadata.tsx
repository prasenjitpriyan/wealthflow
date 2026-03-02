import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your personal finance dashboard — track spending, manage budgets, and view AI-powered insights.',
  openGraph: {
    title: 'Dashboard | WealthFlow',
    description:
      'Your personal finance overview — income, expenses, budgets, and AI insights.',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
