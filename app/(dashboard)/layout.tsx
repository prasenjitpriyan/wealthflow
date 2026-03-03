import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0">
        <div className="w-full">
          <Sidebar />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-none">
          {children}
        </main>
      </div>
    </div>
  );
}
