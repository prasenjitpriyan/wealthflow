'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus, Tag, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const EMOJI_OPTIONS = [
  '📁',
  '🍔',
  '🚗',
  '🏠',
  '💊',
  '✈️',
  '🎮',
  '👗',
  '📚',
  '💼',
  '💰',
  '🏋️',
  '🎵',
  '🐾',
  '🌱',
];
const COLOR_OPTIONS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
  _count: { transactions: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '📁',
    color: '#6366f1',
    type: 'EXPENSE',
  });

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setOpen(false);
    setSaving(false);
    setForm({ name: '', icon: '📁', color: '#6366f1', type: 'EXPENSE' });
    fetchCategories();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organise your transactions with custom categories.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 text-xs gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Groceries"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon: e }))}
                      className={`w-8 h-8 text-lg rounded-md flex items-center justify-center border transition-colors ${
                        form.icon === e
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40'
                      }`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color: c }))}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        form.color === c
                          ? 'border-foreground scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Create Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="border-dashed border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Tag className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No categories yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Create your first category to organise transactions
              </p>
            </div>
            <Button
              size="sm"
              className="h-8 text-xs mt-2"
              onClick={() => setOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="border-border/50 hover:border-primary/20 transition-colors group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${cat.color}20` }}>
                    {cat.icon}
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <CardTitle className="text-sm mt-2">{cat.name}</CardTitle>
                <CardDescription className="text-xs capitalize">
                  {cat.type.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {cat._count.transactions} transaction
                  {cat._count.transactions !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
