'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Transaction {
  id: string;
  description: string;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  date: string;
  notes: string | null;
  categoryId: string | null;
  category: { name: string; icon: string; color: string } | null;
}

type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

const defaultForm: {
  type: TransactionType;
  amount: string;
  description: string;
  date: string;
  categoryId: string;
  notes: string;
} = {
  type: 'EXPENSE',
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  categoryId: '',
  notes: '',
};

export function TransactionsTable() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  async function fetchData() {
    const [txRes, catRes] = await Promise.all([
      fetch('/api/transactions?limit=100'),
      fetch('/api/categories'),
    ]);
    const txData = await txRes.json();
    const catData = await catRes.json();
    setTransactions(txData.transactions ?? []);
    setCategories(catData.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        amount: parseFloat(form.amount),
        categoryId: form.categoryId || undefined,
      }),
    });
    setOpen(false);
    setSaving(false);
    setForm(defaultForm);
    fetchData();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    fetchData();
  }

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      (tx.category?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesType =
      typeFilter === 'all' || tx.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <CardTitle className="text-base font-semibold">
            All Transactions
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-3 mt-2">
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <Select
                      value={form.type}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          type: v as 'INCOME' | 'EXPENSE' | 'TRANSFER',
                        }))
                      }>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Input
                      className="h-8"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      placeholder="e.g. Netflix"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Amount ({session?.user?.currency || 'INR'})</Label>
                      <Input
                        className="h-8"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={form.amount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, amount: e.target.value }))
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Date</Label>
                      <Input
                        className="h-8"
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, date: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {categories.length > 0 && (
                    <div className="space-y-1.5">
                      <Label>Category (optional)</Label>
                      <Select
                        value={form.categoryId}
                        onValueChange={(v) =>
                          setForm((f) => ({ ...f, categoryId: v }))
                        }>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.icon} {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label>Notes (optional)</Label>
                    <Textarea
                      className="text-sm h-16 resize-none"
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, notes: e.target.value }))
                      }
                      placeholder="Add a note..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-8 text-xs"
                    disabled={saving}>
                    {saving && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                    )}
                    Save Transaction
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-4 text-xs font-medium">
                  Transaction
                </TableHead>
                <TableHead className="text-xs font-medium hidden md:table-cell">
                  Category
                </TableHead>
                <TableHead className="text-xs font-medium hidden sm:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-xs font-medium text-right">
                  Amount
                </TableHead>
                <TableHead className="w-10 pr-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-border/40 hover:bg-muted/40 cursor-pointer">
                  <TableCell className="pl-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                        style={{
                          background: tx.category
                            ? `${tx.category.color}20`
                            : 'hsl(var(--muted))',
                        }}>
                        {tx.category?.icon ??
                          (tx.type === 'INCOME' ? '💰' : '💸')}
                      </div>
                      <span className="text-sm font-medium truncate max-w-[140px]">
                        {tx.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tx.category ? (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal">
                        {tx.category.name}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right pr-2">
                    <div
                      className={cn(
                        'flex items-center justify-end gap-0.5 text-sm font-semibold',
                        tx.type === 'INCOME'
                          ? 'text-emerald-500 dark:text-emerald-400'
                          : 'text-foreground'
                      )}>
                      {tx.type === 'INCOME' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                      )}
                      {tx.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(
                        Number(tx.amount),
                        session?.user?.currency,
                        2
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="pr-4 w-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-sm">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(tx.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-sm text-muted-foreground">
                    {transactions.length === 0
                      ? 'No transactions yet. Add your first transaction!'
                      : 'No transactions match your search.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
