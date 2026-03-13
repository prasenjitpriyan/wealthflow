export type PlanType = 'FREE' | 'PRO';

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    maxTransactionsPerMonth: 50,
    maxCategories: 3,
    maxBudgets: 3,
    csvExport: true,
    aiInsights: false,
    multiCurrency: false,
    recurringAutomation: false,
    prioritySupport: false,
  },
  PRO: {
    name: 'Pro',
    price: 99,
    maxTransactionsPerMonth: Infinity,
    maxCategories: Infinity,
    maxBudgets: Infinity,
    csvExport: true,
    aiInsights: true,
    multiCurrency: true,
    recurringAutomation: true,
    prioritySupport: true,
  },
} as const;

export function getPlanLimits(plan: PlanType) {
  return PLANS[plan];
}
