import { BudgetsList } from '@/components/budgets/budgets-list';

export default function BudgetsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Set spending limits and track your budget progress.
        </p>
      </div>
      <BudgetsList />
    </div>
  );
}
