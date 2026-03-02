'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from 'lucide-react';
import { useState } from 'react';

const transactions = [
  {
    id: '1',
    description: 'Netflix Subscription',
    category: 'Entertainment',
    type: 'expense',
    amount: 15.99,
    date: '2026-03-02',
    account: 'Chase Bank',
    emoji: '🎬',
  },
  {
    id: '2',
    description: 'Freelance Payment',
    category: 'Income',
    type: 'income',
    amount: 2500.0,
    date: '2026-03-01',
    account: 'Chase Bank',
    emoji: '💼',
  },
  {
    id: '3',
    description: 'Grocery Store',
    category: 'Food',
    type: 'expense',
    amount: 87.34,
    date: '2026-03-01',
    account: 'Cash',
    emoji: '🛒',
  },
  {
    id: '4',
    description: 'Electric Bill',
    category: 'Housing',
    type: 'expense',
    amount: 142.0,
    date: '2026-02-28',
    account: 'Chase Bank',
    emoji: '⚡',
  },
  {
    id: '5',
    description: 'Gym Membership',
    category: 'Health',
    type: 'expense',
    amount: 49.99,
    date: '2026-02-27',
    account: 'Amex Card',
    emoji: '💪',
  },
  {
    id: '6',
    description: 'Salary Deposit',
    category: 'Income',
    type: 'income',
    amount: 5700.0,
    date: '2026-02-25',
    account: 'Chase Bank',
    emoji: '🏦',
  },
  {
    id: '7',
    description: 'Spotify Premium',
    category: 'Entertainment',
    type: 'expense',
    amount: 9.99,
    date: '2026-02-24',
    account: 'Amex Card',
    emoji: '🎵',
  },
  {
    id: '8',
    description: 'Gas Station',
    category: 'Transport',
    type: 'expense',
    amount: 54.2,
    date: '2026-02-23',
    account: 'Amex Card',
    emoji: '⛽',
  },
  {
    id: '9',
    description: 'Restaurant Dinner',
    category: 'Food',
    type: 'expense',
    amount: 67.5,
    date: '2026-02-22',
    account: 'Amex Card',
    emoji: '🍽️',
  },
  {
    id: '10',
    description: 'Insurance Payment',
    category: 'Health',
    type: 'expense',
    amount: 190.0,
    date: '2026-02-20',
    account: 'Chase Bank',
    emoji: '🏥',
  },
];

export function TransactionsTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
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
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Transaction
            </Button>
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
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5" /> Filters
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="pl-4 text-xs font-medium">
                Transaction
              </TableHead>
              <TableHead className="text-xs font-medium hidden md:table-cell">
                Category
              </TableHead>
              <TableHead className="text-xs font-medium hidden lg:table-cell">
                Account
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
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm shrink-0">
                      {tx.emoji}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[140px]">
                      {tx.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {tx.category}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {tx.account}
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
                      tx.type === 'income'
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-foreground'
                    )}>
                    {tx.type === 'income' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
                    )}
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No transactions found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
