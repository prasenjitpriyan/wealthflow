'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CalendarClock, Info, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type from our API response
interface Notification {
  id: string;
  type: 'BUDGET_ALERT' | 'UPCOMING_BILL' | 'SYSTEM';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('dismissedNotifications');
    if (saved) {
      try {
        setDismissedIds(new Set(JSON.parse(saved)));
      } catch {
        // Ignore JSON parse errors
      }
    }
  }, []);

  const dismiss = (id: string) => {
    const newDismissed = new Set(dismissedIds).add(id);
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedNotifications', JSON.stringify(Array.from(newDismissed)));
  };

  const activeNotifications = notifications.filter((n) => !dismissedIds.has(n.id));
  const hasUnread = activeNotifications.length > 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'BUDGET_ALERT':
        return <TriangleAlert className="w-4 h-4 text-destructive" />;
      case 'UPCOMING_BILL':
        return <CalendarClock className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const handleAction = (url?: string, id?: string) => {
    if (id) dismiss(id);
    if (url) {
      router.push(url);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border border-border/50 shadow-xl">
        <DropdownMenuLabel className="p-3 bg-muted/50 border-b flex items-center justify-between">
          <span className="font-semibold text-sm">Notifications</span>
          {hasUnread && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
              {activeNotifications.length} New
            </span>
          )}
        </DropdownMenuLabel>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
             <div className="p-4 text-center text-sm text-muted-foreground animate-pulse">
               Checking for updates...
             </div>
          ) : activeNotifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Bell className="w-8 h-8 opacity-20" />
              <p>You&apos;re all caught up!</p>
            </div>
          ) : (
            activeNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer border-b last:border-0 rounded-none focus:bg-muted/50 transition-colors"
                onClick={() => handleAction(notification.actionUrl, notification.id)}
              >
                <div className="mt-0.5 bg-background p-1.5 rounded-full border shadow-sm">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 uppercase font-medium">
                    {new Date(notification.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
