import { FinancialHealthScore } from '@/components/dashboard/financial-health';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { StatsCards } from '@/components/dashboard/stats-cards';

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Good evening 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s your financial overview for March 2026.
        </p>
      </div>

      {/* Stats Row */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OverviewChart />
        </div>
        <div>
          <SpendingChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <FinancialHealthScore />
        </div>
      </div>
    </div>
  );
}
