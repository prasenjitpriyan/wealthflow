'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const iconStyles: Record<string, string> = {
  warning: 'text-amber-500 bg-amber-500/10',
  positive: 'text-emerald-500 bg-emerald-500/10',
  suggestion: 'text-primary bg-primary/10',
};

const getIconForType = (type: string, title: string) => {
  if (type === 'positive') return CheckCircle2;
  if (type === 'warning') {
    if (title.toLowerCase().includes('budget')) return TrendingDown;
    return AlertTriangle;
  }
  if (type === 'suggestion') return Lightbulb;
  return AlertCircle;
};

interface Insight {
  type: 'warning' | 'positive' | 'suggestion';
  title: string;
  body: string;
  badge: string;
  badgeVariant: 'default' | 'secondary' | 'destructive';
}

export function InsightsClient({
  initialInsights,
  initialDate,
}: {
  initialInsights?: Insight[];
  initialDate?: Date;
}) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights || []);
  const [lastGenerated, setLastGenerated] = useState<Date | undefined>(
    initialDate
  );
  const [isLoading, setIsLoading] = useState(!initialInsights);

  const fetchInsights = async (force = false) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/dashboard/insights${force ? '?force=true' : ''}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch insights');
      }
      setInsights(data.insights || []);
      setLastGenerated(new Date(data.generatedAt));
    } catch (e: unknown) {
      console.error(e);
      const err = e as Error;
      toast.error(err.message || 'Something went wrong while fetching insights');
    } finally {
      setIsLoading(false);
    }
  };

  // If no initial insights, fetch them on mount (e.g. first time user visits)
  useEffect(() => {
    if (!initialInsights && insights.length === 0) {
      fetchInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between py-4 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI Analysis Complete</p>
              <p className="text-xs text-muted-foreground">
                Based on up to 30 days of transaction history •{' '}
                {isLoading ? (
                  <span className="animate-pulse">Generating...</span>
                ) : lastGenerated ? (
                  `Updated ${lastGenerated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}`
                ) : (
                  'No insights yet'
                )}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchInsights(true)}
            disabled={isLoading}
            className="h-8 text-xs border-primary/30">
            {isLoading && <Loader2 className="w-3 h-3 mr-2 animate-spin" />}
            Regenerate insights
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isLoading && insights.length === 0
          ? // Skeleton loading
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="py-4 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                    <div className="h-3 bg-muted animate-pulse rounded w-full" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          : insights.length > 0
            ? insights.map((insight, i) => {
                const Icon = getIconForType(insight.type, insight.title);
                return (
                  <Card
                    key={i}
                    className="border-border/50 hover:border-primary/20 transition-colors group">
                    <CardContent className="py-4 flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          iconStyles[insight.type] ||
                          'text-muted-foreground bg-muted'
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="text-sm font-semibold">
                            {insight.title}
                          </p>
                          <Badge
                            variant={insight.badgeVariant || 'default'}
                            className="text-xs shrink-0">
                            {insight.badge}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {insight.body}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            : !isLoading && (
                <Card className="border-border/50">
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p className="text-sm">No insights available.</p>
                    <Button
                      variant="link"
                      onClick={() => fetchInsights(true)}
                      className="mt-2 text-xs">
                      Generate now
                    </Button>
                  </CardContent>
                </Card>
              )}
      </div>
    </>
  );
}
