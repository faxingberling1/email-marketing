export type SubscriptionTier = 'free' | 'starter' | 'growth' | 'pro' | 'enterprise';

export interface TierLimits {
    contacts: number;
    emails_per_month: number;
    ai_credits_per_month: number;
    automation_workflows: number;
    features: {
        ab_testing: boolean;
        api_access: boolean;
        custom_branding: boolean;
        predictive_analytics: boolean;
    };
}

export const TIER_CONFIG: Record<SubscriptionTier, TierLimits> = {
    free: {
        contacts: 100,
        emails_per_month: 500,
        ai_credits_per_month: 50,
        automation_workflows: 0,
        features: {
            ab_testing: false,
            api_access: false,
            custom_branding: false,
            predictive_analytics: false,
        }
    },
    starter: {
        contacts: 1000,
        emails_per_month: 10000,
        ai_credits_per_month: 300,
        automation_workflows: 1,
        features: {
            ab_testing: false,
            api_access: false,
            custom_branding: false,
            predictive_analytics: false,
        }
    },
    growth: {
        contacts: 10000,
        emails_per_month: 75000,
        ai_credits_per_month: 2000,
        automation_workflows: 10,
        features: {
            ab_testing: true,
            api_access: false,
            custom_branding: false,
            predictive_analytics: false,
        }
    },
    pro: {
        contacts: 25000,
        emails_per_month: 200000,
        ai_credits_per_month: 6000,
        automation_workflows: 1000000, // Effectively unlimited
        features: {
            ab_testing: true,
            api_access: true,
            custom_branding: true,
            predictive_analytics: true,
        }
    },
    enterprise: {
        contacts: 1000000,
        emails_per_month: 10000000,
        ai_credits_per_month: 100000,
        automation_workflows: 1000000,
        features: {
            ab_testing: true,
            api_access: true,
            custom_branding: true,
            predictive_analytics: true,
        }
    }
};

export function getTierLimits(tier: string): TierLimits {
    return TIER_CONFIG[tier as SubscriptionTier] || TIER_CONFIG.free;
}

export const TIER_META_MAP: Record<SubscriptionTier, { label: string; gradient: string; accent: string; accentBg: string }> = {
    free: { label: "Free", gradient: "from-slate-600 to-slate-500", accent: "text-slate-400", accentBg: "bg-slate-500/10 border-slate-500/20" },
    starter: { label: "Starter", gradient: "from-blue-600 to-cyan-500", accent: "text-blue-400", accentBg: "bg-blue-500/10 border-blue-500/20" },
    growth: { label: "Growth", gradient: "from-emerald-600 to-teal-500", accent: "text-emerald-400", accentBg: "bg-emerald-500/10 border-emerald-500/20" },
    pro: { label: "Pro", gradient: "from-indigo-600 to-violet-600", accent: "text-indigo-400", accentBg: "bg-indigo-500/10 border-indigo-500/20" },
    enterprise: { label: "Enterprise", gradient: "from-rose-600 to-pink-600", accent: "text-rose-400", accentBg: "bg-rose-500/10 border-rose-500/20" },
}
