'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BillingCard } from '@/components/settings/billing-card';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'SGD'];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session?.user?.name) setName(session.user.name);

    if (session?.user?.currency) setCurrency(session.user.currency);
  }, [session]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Update the name via PATCH /api/user (future route) or inline
    await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, currency }),
    }).catch(() => {});
    await update({ name, currency }); // refresh session
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-[720px] mx-auto">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage your account and preferences.
          </p>
        </div>
      </div>

      {/* Profile */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your display name and email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email ?? ''}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed.
              </p>
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs"
              disabled={saving}>
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-2" />
              )}
              {saved ? 'Saved!' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Preferences */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>
            Customise your currency and display settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-48 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={handleSave}
            disabled={saving}>
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-2" />
            )}
            {saved ? 'Saved!' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Billing */}
      <BillingCard />
    </div>
  );
}
