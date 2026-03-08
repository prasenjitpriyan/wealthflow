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
import { scaleIn, stagger } from '@/lib/animations';
import { motion } from 'framer-motion';
import { Loader2, Plus, Sparkles, Tag, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

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
  '🚬',
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

type Suggestion = { icon: string; color: string; type: string };

const RULES: Array<{ keywords: string[]; suggestion: Suggestion }> = [
  // INCOME
  {
    keywords: ['salary', 'wage', 'payroll', 'income', 'paycheck', 'pay'],
    suggestion: { icon: '💰', color: '#10b981', type: 'INCOME' },
  },
  {
    keywords: ['freelance', 'consulting', 'contract', 'gig', 'side', 'hustle'],
    suggestion: { icon: '💼', color: '#10b981', type: 'INCOME' },
  },
  {
    keywords: [
      'dividend',
      'investment',
      'interest',
      'returns',
      'profit',
      'stock',
    ],
    suggestion: { icon: '📈', color: '#10b981', type: 'INCOME' },
  },
  {
    keywords: ['rent income', 'rental income', 'lease income'],
    suggestion: { icon: '🏠', color: '#10b981', type: 'INCOME' },
  },
  {
    keywords: ['bonus', 'commission', 'tip', 'tips', 'reward', 'gift received'],
    suggestion: { icon: '💰', color: '#10b981', type: 'INCOME' },
  },
  // TRANSFER
  {
    keywords: ['transfer', 'wire', 'send money', 'withdraw', 'deposit'],
    suggestion: { icon: '📁', color: '#6366f1', type: 'TRANSFER' },
  },
  // EXPENSE — Food
  {
    keywords: [
      'food',
      'grocery',
      'groceries',
      'supermarket',
      'restaurant',
      'dining',
      'eat',
      'meal',
      'lunch',
      'dinner',
      'breakfast',
      'snack',
      'coffee',
      'cafe',
    ],
    suggestion: { icon: '🍔', color: '#f59e0b', type: 'EXPENSE' },
  },
  // EXPENSE — Transport
  {
    keywords: [
      'transport',
      'car',
      'fuel',
      'gas',
      'petrol',
      'uber',
      'taxi',
      'bus',
      'train',
      'subway',
      'commute',
      'metro',
      'auto',
      'rickshaw',
      'vehicle',
      'parking',
    ],
    suggestion: { icon: '🚗', color: '#3b82f6', type: 'EXPENSE' },
  },
  // EXPENSE — Housing
  {
    keywords: [
      'rent',
      'mortgage',
      'housing',
      'home',
      'house',
      'apartment',
      'electricity',
      'utility',
      'water',
      'maintenance',
      'repair',
    ],
    suggestion: { icon: '🏠', color: '#ef4444', type: 'EXPENSE' },
  },
  // EXPENSE — Health
  {
    keywords: [
      'health',
      'medical',
      'doctor',
      'hospital',
      'pharmacy',
      'medicine',
      'drug',
      'insurance',
      'dental',
      'vision',
      'clinic',
    ],
    suggestion: { icon: '💊', color: '#10b981', type: 'EXPENSE' },
  },
  // EXPENSE — Travel
  {
    keywords: [
      'travel',
      'flight',
      'hotel',
      'vacation',
      'holiday',
      'trip',
      'airfare',
      'booking',
      'accommodation',
    ],
    suggestion: { icon: '✈️', color: '#06b6d4', type: 'EXPENSE' },
  },
  // EXPENSE — Entertainment
  {
    keywords: [
      'gaming',
      'game',
      'netflix',
      'streaming',
      'subscription',
      'entertainment',
      'movie',
      'sport',
      'hobby',
    ],
    suggestion: { icon: '🎮', color: '#8b5cf6', type: 'EXPENSE' },
  },
  // EXPENSE — Clothing
  {
    keywords: [
      'clothing',
      'clothes',
      'fashion',
      'shopping',
      'apparel',
      'shoes',
      'dress',
      'outfit',
      'wear',
    ],
    suggestion: { icon: '👗', color: '#ec4899', type: 'EXPENSE' },
  },
  // EXPENSE — Education
  {
    keywords: [
      'education',
      'school',
      'tuition',
      'course',
      'book',
      'learning',
      'training',
      'study',
      'college',
      'university',
    ],
    suggestion: { icon: '📚', color: '#6366f1', type: 'EXPENSE' },
  },
  // EXPENSE — Fitness
  {
    keywords: [
      'gym',
      'fitness',
      'workout',
      'exercise',
      'sport',
      'yoga',
      'wellness',
    ],
    suggestion: { icon: '🏋️', color: '#10b981', type: 'EXPENSE' },
  },
  // EXPENSE — Music
  {
    keywords: ['music', 'spotify', 'concert', 'instrument'],
    suggestion: { icon: '🎵', color: '#8b5cf6', type: 'EXPENSE' },
  },
  // EXPENSE — Pets
  {
    keywords: ['pet', 'dog', 'cat', 'vet', 'animal', 'grooming'],
    suggestion: { icon: '🐾', color: '#f59e0b', type: 'EXPENSE' },
  },
  // EXPENSE — Nature
  {
    keywords: ['garden', 'plant', 'nature', 'green', 'eco'],
    suggestion: { icon: '🌱', color: '#10b981', type: 'EXPENSE' },
  },
  // EXPENSE — Tobacco / Smoking
  {
    keywords: [
      'cigarette',
      'cigar',
      'tobacco',
      'smoke',
      'vape',
      'nicotine',
      'cigarate',
      'sigaret',
    ],
    suggestion: { icon: '�', color: '#8b5cf6', type: 'EXPENSE' },
  },
  // EXPENSE — Alcohol
  {
    keywords: [
      'alcohol',
      'beer',
      'wine',
      'liquor',
      'bar',
      'pub',
      'drink',
      'spirits',
    ],
    suggestion: { icon: '🍔', color: '#ef4444', type: 'EXPENSE' },
  },
  // EXPENSE — Beauty & Personal Care
  {
    keywords: [
      'beauty',
      'salon',
      'haircut',
      'hair',
      'makeup',
      'cosmetic',
      'spa',
      'skincare',
      'personal care',
    ],
    suggestion: { icon: '👗', color: '#ec4899', type: 'EXPENSE' },
  },
  // EXPENSE — Taxes
  {
    keywords: ['tax', 'taxes', 'gst', 'vat', 'income tax', 'duty'],
    suggestion: { icon: '📚', color: '#6366f1', type: 'EXPENSE' },
  },
  // EXPENSE — Charity & Donations
  {
    keywords: [
      'charity',
      'donation',
      'donate',
      'ngo',
      'zakat',
      'tithe',
      'nonprofit',
    ],
    suggestion: { icon: '🌱', color: '#10b981', type: 'EXPENSE' },
  },
  // EXPENSE — Tech & Electronics
  {
    keywords: [
      'tech',
      'gadget',
      'phone',
      'laptop',
      'computer',
      'electronics',
      'software',
      'app',
      'internet',
      'wifi',
      'broadband',
    ],
    suggestion: { icon: '🎮', color: '#3b82f6', type: 'EXPENSE' },
  },
  // EXPENSE — Kids & Baby
  {
    keywords: [
      'baby',
      'kids',
      'child',
      'toy',
      'school fee',
      'daycare',
      'diaper',
    ],
    suggestion: { icon: '📁', color: '#06b6d4', type: 'EXPENSE' },
  },
];

function suggestCategory(name: string): Suggestion | null {
  const lower = name.toLowerCase();
  for (const rule of RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.suggestion;
    }
  }
  return null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '📁',
    color: '#6366f1',
    type: 'EXPENSE',
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories ?? []);
      setLoading(false);
    })();
  }, []);

  const runSuggest = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setSuggesting(true);
    try {
      // Try AI first
      const res = await fetch('/api/categories/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm((f) => ({
          ...f,
          icon: data.icon || f.icon,
          color: data.color || f.color,
          type: data.type || f.type,
        }));
        toast.success('AI auto-filled icon & type!');
        setSuggesting(false);
        return;
      }
    } catch {
      // AI unavailable — fall through to keyword matching
    }

    // Keyword-based fallback
    const suggestion = suggestCategory(name);
    if (suggestion) {
      setForm((f) => ({ ...f, ...suggestion }));
      toast.success('Auto-filled from keyword match!');
    }
    setSuggesting(false);
  }, []);

  // Auto-suggest with debounce whenever name changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!form.name.trim()) return;
    debounceRef.current = setTimeout(() => {
      runSuggest(form.name);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.name, runSuggest]);

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
                <div className="flex items-center justify-between">
                  <Label>Name</Label>
                  {suggesting && (
                    <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      AI suggesting…
                    </span>
                  )}
                </div>
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
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={stagger(0, 0.06)}
          initial="hidden"
          animate="visible">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={scaleIn}
              whileHover={{
                y: -6,
                boxShadow: `0 16px 32px -8px ${cat.color}40`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
              <Card className="border-border/50 hover:border-primary/20 transition-colors group h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${cat.color}20` }}
                      whileHover={{ scale: 1.18, rotate: 10 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}>
                      {cat.icon}
                    </motion.div>
                    <motion.button
                      onClick={() => handleDelete(cat.id)}
                      className="text-muted-foreground hover:text-destructive"
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileHover={{ scale: 1.15 }}
                      animate={{ opacity: 0 }}
                      whileFocus={{ opacity: 1 }}
                      style={{ cursor: 'pointer' }}
                      // group-hover managed by CSS below
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
