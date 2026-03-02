import { TransactionsTable } from '@/components/transactions/transactions-table';

export default function TransactionsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and track all your income and expenses.
        </p>
      </div>
      <TransactionsTable />
    </div>
  );
}
