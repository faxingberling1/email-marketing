"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    X, Sparkles, GitBranch, CheckCircle2, XCircle,
    ArrowRight, Users, Mail, Crown, Loader2, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TIER_CONFIG, SubscriptionTier } from "@/lib/tiers"
import { getPlanModalData } from "@/app/(dashboard)/sidebar-actions"
import Link from "next/link"

interface PlanDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    currentPlan: string
}

const TIER_ORDER: SubscriptionTier[] = ['free', 'starter', 'growth', 'pro', 'enterprise']

const TIER_META: Record<SubscriptionTier, {
    label: string
    gradient: string
    glowClass: string
    accent: string
    accentBg: string
}> = {
    free: { label: "Free", gradient: "from-slate-600 to-slate-500", glowClass: "", accent: "text-slate-400", accentBg: "bg-slate-500/10 border-slate-500/20" },
    starter: { label: "Starter", gradient: "from-blue-600 to-cyan-500", glowClass: "shadow-blue-500/20", accent: "text-blue-400", accentBg: "bg-blue-500/10 border-blue-500/20" },
    growth: { label: "Growth", gradient: "from-emerald-600 to-teal-500", glowClass: "shadow-emerald-500/20", accent: "text-emerald-400", accentBg: "bg-emerald-500/10 border-emerald-500/20" },
    pro: { label: "Pro", gradient: "from-indigo-600 to-violet-600", glowClass: "shadow-indigo-500/30", accent: "text-indigo-400", accentBg: "bg-indigo-500/10 border-indigo-500/20" },
    enterprise: { label: "Enterprise", gradient: "from-rose-600 to-pink-600", glowClass: "shadow-rose-500/30", accent: "text-rose-400", accentBg: "bg-rose-500/10 border-rose-500/20" },
}

function ResourceBar({
    label, icon: Icon, remaining, used, limit, accentText, barBg, delay = 0
}: {
    label: string; icon: any
    remaining: number; used: number; limit: number
    accentText: string; barBg: string; delay?: number
}) {
    const pct = limit > 0 ? Math.min(100, Math.max(0, (remaining / limit) * 100)) : 0
    const danger = pct < 20
    const warning = pct < 40 && pct >= 20

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={cn("h-3.5 w-3.5", danger ? "text-rose-400" : warning ? "text-amber-400" : accentText)} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
                    {danger && (
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest border border-rose-500/30 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                            LOW
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 font-mono">
                    <span className={cn("text-sm font-black tabular-nums", danger ? "text-rose-400" : warning ? "text-amber-400" : accentText)}>
                        {remaining >= 1000000 ? "∞" : remaining.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-700 font-bold">
                        / {limit >= 999999 ? "∞" : limit.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Track */}
            <div className="relative h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay, ease: [0.34, 1.2, 0.64, 1] }}
                    className={cn(
                        "absolute left-0 top-0 h-full rounded-full",
                        danger ? "bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                            : warning ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                : cn(barBg, "shadow-[0_0_8px_rgba(99,102,241,0.3)]")
                    )}
                />
            </div>

            <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                <span>{used.toLocaleString()} used</span>
                <span>{remaining >= 1000000 ? "Unlimited" : `${remaining.toLocaleString()} left`}</span>
            </div>
        </div>
    )
}

export function PlanDetailsModal({ isOpen, onClose, currentPlan }: PlanDetailsModalProps) {
    const [data, setData] = useState<Awaited<ReturnType<typeof getPlanModalData>>>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) return
        setLoading(true)
        setData(null)
        getPlanModalData().then(d => {
            setData(d)
            setLoading(false)
        })
    }, [isOpen])

    if (!isOpen) return null

    const rawPlan = ((data?.plan ?? currentPlan) || 'free').toLowerCase()
    const validPlan: SubscriptionTier = TIER_ORDER.includes(rawPlan as SubscriptionTier) ? rawPlan as SubscriptionTier : 'free'
    const limits = TIER_CONFIG[validPlan]
    const meta = TIER_META[validPlan]

    // Contact count — comes directly from userId-based DB query (always accurate)
    const contactsUsed = data?.counts?.contacts ?? 0
    const contactLimit = limits.contacts
    const contactsRemaining = Math.max(0, contactLimit - contactsUsed)

    const aiRemaining = data?.quotas?.ai?.remaining ?? limits.ai_credits_per_month
    const aiLimit = data?.quotas?.ai?.limit ?? limits.ai_credits_per_month
    const aiUsed = aiLimit - aiRemaining

    const emailRemaining = data?.quotas?.emails?.remaining ?? limits.emails_per_month
    const emailLimit = data?.quotas?.emails?.limit ?? limits.emails_per_month
    const emailUsed = emailLimit - emailRemaining

    const idx = TIER_ORDER.indexOf(validPlan)
    const nextTier = idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null
    const nextMeta = nextTier ? TIER_META[nextTier] : null
    const nextLimits = nextTier ? TIER_CONFIG[nextTier] : null

    const features = [
        { name: "A/B Testing", enabled: limits.features.ab_testing },
        { name: "API Access", enabled: limits.features.api_access },
        { name: "Custom Branding", enabled: limits.features.custom_branding },
        { name: "Predictive Analytics", enabled: limits.features.predictive_analytics },
    ]

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                {/* Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 48 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 48 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={cn(
                        "relative w-full max-w-sm mx-4 mb-0 sm:mb-4",
                        "rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]",
                        "bg-slate-950 border border-white/[0.06]",
                        "shadow-2xl", meta.glowClass
                    )}
                >
                    {/* Glow accent line at top */}
                    <div className={cn("h-px w-full bg-gradient-to-r via-white/20 from-transparent to-transparent", meta.gradient)} />

                    {/* Header */}
                    <div className="px-5 pt-5 pb-4 border-b border-white/[0.04] shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                {/* Tier icon */}
                                <div className={cn(
                                    "h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
                                    meta.gradient, meta.glowClass
                                )}>
                                    <Crown className="h-5 w-5 text-white drop-shadow" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.25em]">Active Subscription</p>
                                    <h2 className="text-lg font-black text-white tracking-tight leading-tight">{meta.label} Plan</h2>
                                    {loading ? (
                                        <span className="text-[9px] text-slate-600 uppercase tracking-widest flex items-center gap-1">
                                            <Loader2 className="h-2.5 w-2.5 animate-spin" /> Syncing…
                                        </span>
                                    ) : data ? (
                                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                            Live
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/5 text-slate-500 hover:text-white hover:border-white/20 transition-all"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

                        {/* Resource Usage */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 mb-3">Resource Pulse</p>
                            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 space-y-5">
                                <ResourceBar
                                    label="Contacts" icon={Users}
                                    remaining={contactsRemaining} used={contactsUsed} limit={contactLimit}
                                    accentText="text-indigo-400" barBg="bg-indigo-500" delay={0}
                                />
                                <ResourceBar
                                    label="AI Credits" icon={Sparkles}
                                    remaining={aiRemaining} used={aiUsed} limit={aiLimit}
                                    accentText="text-cyan-400" barBg="bg-cyan-500" delay={0.08}
                                />
                                <ResourceBar
                                    label="Emails / Mo" icon={Mail}
                                    remaining={emailRemaining} used={emailUsed} limit={emailLimit}
                                    accentText="text-emerald-400" barBg="bg-emerald-500" delay={0.16}
                                />
                            </div>
                        </div>

                        {/* Plan limits quick stat */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 mb-3">Plan Limits</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { icon: Users, label: "Contacts", val: contactLimit >= 1000000 ? "Unlimited" : contactLimit.toLocaleString(), color: "text-indigo-400", bg: "bg-indigo-500/[0.07]", border: "border-indigo-500/10" },
                                    { icon: Mail, label: "Emails / mo", val: emailLimit >= 1000000 ? "Unlimited" : `${(emailLimit / 1000).toFixed(0)}k`, color: "text-emerald-400", bg: "bg-emerald-500/[0.07]", border: "border-emerald-500/10" },
                                    { icon: Sparkles, label: "AI Credits", val: aiLimit >= 100000 ? "Unlimited" : aiLimit.toLocaleString(), color: "text-cyan-400", bg: "bg-cyan-500/[0.07]", border: "border-cyan-500/10" },
                                    { icon: GitBranch, label: "Automations", val: limits.automation_workflows >= 999999 ? "Unlimited" : limits.automation_workflows.toString(), color: "text-violet-400", bg: "bg-violet-500/[0.07]", border: "border-violet-500/10" },
                                ].map((t, i) => (
                                    <div key={i} className={cn("rounded-xl p-3 border", t.bg, t.border)}>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <t.icon className={cn("h-3 w-3 shrink-0", t.color)} />
                                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest truncate">{t.label}</span>
                                        </div>
                                        <p className={cn("text-sm font-black tabular-nums leading-tight", t.color)}>{t.val}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 mb-3">Included Features</p>
                            <div className="grid grid-cols-2 gap-1.5">
                                {features.map((f, i) => (
                                    <div key={i} className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold",
                                        f.enabled
                                            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                            : "bg-white/[0.015] border-white/[0.04] text-slate-700"
                                    )}>
                                        {f.enabled
                                            ? <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                                            : <XCircle className="h-3 w-3 shrink-0 text-slate-800" />
                                        }
                                        <span className="truncate">{f.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upgrade CTA */}
                        {nextTier && nextLimits && nextMeta && (
                            <div className={cn("rounded-2xl border overflow-hidden", nextMeta.accentBg)}>
                                <div className="px-4 pt-4 pb-3">
                                    <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", nextMeta.accent)}>
                                        Upgrade to {nextMeta.label}
                                    </p>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {nextLimits.contacts >= 1000000 ? "Unlimited" : nextLimits.contacts.toLocaleString()} contacts ·{" "}
                                        {nextLimits.emails_per_month >= 1000000 ? "Unlimited" : `${(nextLimits.emails_per_month / 1000).toFixed(0)}k`} emails ·{" "}
                                        {nextLimits.ai_credits_per_month >= 100000 ? "Unlimited" : nextLimits.ai_credits_per_month.toLocaleString()} AI credits
                                    </p>
                                </div>
                                <Link
                                    href="/billing"
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center justify-center gap-2 mx-4 mb-4 py-2.5 rounded-xl",
                                        "text-[10px] font-black uppercase tracking-[0.15em] text-white",
                                        "bg-gradient-to-r transition-all hover:opacity-90 shadow-lg",
                                        nextMeta.gradient
                                    )}
                                >
                                    Upgrade Now <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
