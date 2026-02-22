"use client"

import { motion } from "framer-motion"
import {
    Rocket, ArrowUpRight, Activity,
    Sparkles, Users, Mail, GitBranch,
    CheckCircle2, XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { TIER_META_MAP } from "@/lib/tiers"

interface SubscriptionSettingsProps {
    data: {
        planKey: string
        plan: string
        emailLimit: number
        emailsUsed: number
        emailUsagePct: number
        aiCreditsLimit: number
        aiCreditsUsed: number
        aiUsagePct: number
        contactsUsed: number
        contactsLimit: number
        campaignCount: number
        features: {
            ab_testing: boolean
            api_access: boolean
            custom_branding: boolean
            predictive_analytics: boolean
        }
    }
}

function UsageStat({
    icon: Icon, label, used, limit, usagePct, color, barColor, delay = 0
}: {
    icon: any; label: string
    used: number; limit: number; usagePct: number
    color: string; barColor: string; delay?: number
}) {
    const danger = usagePct > 80
    const warning = usagePct > 60 && usagePct <= 80
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className={cn("h-3.5 w-3.5", danger ? "text-rose-400" : warning ? "text-amber-400" : color)} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
                <span className={cn("text-xs font-black tabular-nums", danger ? "text-rose-400" : warning ? "text-amber-400" : color)}>
                    {usagePct}%
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, usagePct)}%` }}
                    transition={{ duration: 1, delay, ease: [0.34, 1.2, 0.64, 1] }}
                    className={cn("h-full rounded-full", danger ? "bg-rose-500" : warning ? "bg-amber-500" : barColor)}
                />
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                <span>{used.toLocaleString()} used</span>
                <span>{(limit - used).toLocaleString()} left of {limit >= 1000000 ? "∞" : limit.toLocaleString()}</span>
            </div>
        </div>
    )
}

export function SubscriptionSettings({ data }: SubscriptionSettingsProps) {
    const contactPct = data.contactsLimit > 0
        ? Math.round((data.contactsUsed / data.contactsLimit) * 100)
        : 0

    const featureList = [
        { name: "A/B Testing", enabled: data.features.ab_testing },
        { name: "API Access", enabled: data.features.api_access },
        { name: "Custom Branding", enabled: data.features.custom_branding },
        { name: "Predictive Analytics", enabled: data.features.predictive_analytics },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Rocket className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Orbital Resources</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subscription &amp; Usage Intelligence</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Plan Card */}
                <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-5">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-[0.2em]">
                            Active Protocol
                        </span>
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Live
                        </span>
                    </div>

                    <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter">{data.plan}</h3>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                            {data.campaignCount} active campaign{data.campaignCount !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Contacts</p>
                            <p className="text-lg font-black text-indigo-400 tabular-nums">{data.contactsUsed.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-700">of {data.contactsLimit.toLocaleString()}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] space-y-1">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">AI Credits left</p>
                            <p className="text-lg font-black text-cyan-400 tabular-nums">{(data.aiCreditsLimit - data.aiCreditsUsed).toLocaleString()}</p>
                            <p className="text-[9px] text-slate-700">of {data.aiCreditsLimit.toLocaleString()}</p>
                        </div>
                    </div>

                    <Link href="/billing" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 py-3.5 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.3em] transition-all border border-white/5">
                        Manage Subscription <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* Usage bars */}
                <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-5">
                    <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-400" />
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">Usage Surveillance</h4>
                    </div>
                    <UsageStat
                        icon={Mail} label="Emails / Month"
                        used={data.emailsUsed} limit={data.emailLimit} usagePct={data.emailUsagePct}
                        color="text-emerald-400" barColor="bg-emerald-500" delay={0}
                    />
                    <UsageStat
                        icon={Sparkles} label="AI Credits"
                        used={data.aiCreditsUsed} limit={data.aiCreditsLimit} usagePct={data.aiUsagePct}
                        color="text-cyan-400" barColor="bg-cyan-500" delay={0.08}
                    />
                    <UsageStat
                        icon={Users} label="Contacts"
                        used={data.contactsUsed} limit={data.contactsLimit} usagePct={contactPct}
                        color="text-indigo-400" barColor="bg-indigo-500" delay={0.16}
                    />
                </div>
            </div>

            {/* Feature flags */}
            <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 mb-3">Included Features</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {featureList.map((f, i) => (
                        <motion.div
                            key={f.name}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.07 }}
                            className={cn(
                                "flex items-center gap-2 p-3 rounded-xl border text-[10px] font-bold",
                                f.enabled
                                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                                    : "bg-white/[0.015] border-white/[0.04] text-slate-700"
                            )}
                        >
                            {f.enabled
                                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                : <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-800" />
                            }
                            <span className="truncate">{f.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
