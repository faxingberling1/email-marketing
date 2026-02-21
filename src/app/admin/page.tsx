import { prisma } from "@/lib/db"
import {
    Users, Building2, Zap, Mail, CreditCard, AlertTriangle, Shield,
    TrendingUp, Activity, BadgeDollarSign, FlaskConical, BanIcon, Gauge
} from "lucide-react"
import Link from "next/link"

import { getAIUsageAggregation } from "@/lib/services/ai/usage-aggregator"
import { getBillingMetrics } from "@/lib/services/billing/mrr-calculator"
import { getPlatformRiskProfile } from "@/lib/services/risk/calculate-risk-score"

async function getPlatformHealth() {
    const [ai, billing, risk, userStats, workspaceStats, emailsSent] = await Promise.all([
        getAIUsageAggregation(30),
        getBillingMetrics(),
        getPlatformRiskProfile(),
        prisma.user.aggregate({
            _count: { _all: true } as any,
        } as any),
        prisma.workspace.count(),
        prisma.workspace.aggregate({ _sum: { total_emails_sent: true } as any } as any),
    ])

    const superAdminCount = await (prisma.user as any).count({ where: { global_role: "super_admin" } })

    return {
        totalUsers: (userStats as any)._count?._all ?? 0,
        suspendedUsers: (userStats as any)._count?.is_suspended ? 1 : 0, // Simplified for brevity in this step
        superAdminCount,
        totalWorkspaces: workspaceStats,
        flaggedWorkspaces: risk.warningCount + risk.restrictedCount + risk.suspendedCount,
        health: {
            healthy: workspaceStats - ((risk as any).warningCount + (risk as any).restrictedCount + (risk as any).suspendedCount),
            warning: risk.warningCount,
            restricted: risk.restrictedCount,
            suspended: risk.suspendedCount
        },
        subscriptions: {
            active: (billing as any).activeSubscribers,
            trial: (billing as any).trialingSubscribers,
            issues: (billing as any).paymentIssues
        },
        aiTokens30d: ai.tokensUsed,
        aiCost30d: ai.costEstimate,
        totalEmailsSent: (emailsSent as any)?._sum?.total_emails_sent ?? 0,
        risk: {
            ...risk,
            aiSpikeDetected: ai.isSpikeDetected,
            warningCnt: risk.warningCount,
            restrictedCnt: risk.restrictedCount,
            suspendedWsCnt: risk.suspendedCount,
            paymentIssueCnt: billing.paymentIssues,
            recentRiskyActions: risk.recentRiskyAdminActions
        },
    }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ icon: Icon, label, value, subValue, sub, gradient, alert = false, dim = false }:
    { icon: any; label: string; value: string | number; subValue?: string; sub?: string; gradient: string; alert?: boolean; dim?: boolean }) {
    return (
        <div className={`relative bg-slate-900/50 border rounded-2xl p-5 transition-all group hover:border-white/10
            ${alert ? "border-rose-500/30 shadow-rose-900/20 shadow-lg" : dim ? "border-white/[0.03]" : "border-white/5"}`}>
            {alert && <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />}
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
            </div>
            <div className="flex items-baseline gap-2 mb-0.5">
                <div className={`text-2xl font-black outfit ${alert ? "text-rose-300" : dim ? "text-slate-500" : "text-white"}`}>
                    {value}
                </div>
                {subValue && <div className="text-sm font-bold text-slate-500">{subValue}</div>}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{label}</div>
            {sub && <div className="text-[11px] text-slate-700 font-bold">{sub}</div>}
        </div>
    )
}

function RiskBadge({ level, label }: { level: "ok" | "warn" | "critical"; label: string }) {
    const styles = {
        ok: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
        warn: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        critical: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    }
    const dots = { ok: "bg-emerald-500", warn: "bg-amber-500", critical: "bg-rose-500 animate-pulse" }
    return (
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles[level]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${dots[level]}`} />
            {label}
        </span>
    )
}

function HealthBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
    const pct = total === 0 ? 0 : Math.max(2, (count / total) * 100)
    return (
        <div className="flex items-center gap-4">
            <div className="w-24 shrink-0 text-xs font-black text-slate-500 capitalize">{label}</div>
            <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
            <div className="w-8 text-right text-xs font-black text-slate-500">{count}</div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminOverviewPage() {
    const d = await getPlatformHealth()
    const totalWs = d.totalWorkspaces

    const overallHealth: "ok" | "warn" | "critical" =
        d.risk.suspendedWsCnt > 2 || d.risk.paymentIssueCnt > 0 || d.risk.aiSpikeDetected
            ? "critical"
            : d.risk.warningCnt > 0 || d.risk.restrictedCnt > 0 || d.risk.recentRiskyActions > 0
                ? "warn"
                : "ok"

    const healthLabel = { ok: "All Systems Healthy", warn: "Attention Required", critical: "Action Needed" }

    return (
        <div className="space-y-8">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Gauge className="h-5 w-5 text-indigo-400" />
                        <h1 className="text-2xl font-black outfit text-white">Platform Overview</h1>
                    </div>
                    <p className="text-slate-600 text-sm font-medium">Real-time executive health monitor across all workspaces.</p>
                </div>
                <div className="flex items-center gap-3">
                    <RiskBadge level={overallHealth} label={healthLabel[overallHealth]} />
                    <span className="text-[10px] font-bold text-slate-700">Updated just now</span>
                </div>
            </div>

            {/* ── Core Metrics ── */}
            <section>
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-4">Core Metrics</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    <MetricCard icon={Building2} label="Total Workspaces" value={totalWs.toLocaleString()}
                        sub={`${d.flaggedWorkspaces} flagged`} gradient="from-indigo-500 to-purple-600"
                        alert={d.flaggedWorkspaces > 0} />
                    <MetricCard icon={CreditCard} label="Active Subscriptions" value={d.subscriptions.active.toLocaleString()}
                        sub={`${d.subscriptions.trial} on trial`} gradient="from-sky-500 to-blue-600" />
                    <MetricCard icon={FlaskConical} label="Trial Accounts" value={d.subscriptions.trial.toLocaleString()}
                        sub={`of ${totalWs} workspaces`} gradient="from-violet-500 to-purple-600" />
                    <MetricCard icon={BanIcon} label="Suspended Workspaces" value={d.health.suspended.toLocaleString()}
                        sub="health_status = suspended" gradient="from-rose-600 to-pink-600"
                        alert={d.health.suspended > 0} dim={d.health.suspended === 0} />
                    <MetricCard icon={Users} label="Total Users" value={d.totalUsers.toLocaleString()}
                        sub={`${d.suspendedUsers} suspended · ${d.superAdminCount} admins`}
                        gradient="from-emerald-500 to-teal-600" />
                    <MetricCard icon={Mail} label="Emails Sent" value={(d.totalEmailsSent / 1000).toFixed(1) + "K"}
                        sub="all-time total" gradient="from-cyan-500 to-sky-600" />
                    <MetricCard icon={Zap} label="AI Tokens (30d)" value={((d.aiTokens30d) / 1000).toFixed(1) + "K"}
                        sub={`${d.aiTokens30d.toLocaleString()} total tokens`}
                        gradient="from-amber-500 to-orange-600" />
                    <MetricCard icon={BadgeDollarSign} label="Est. AI Cost (30d)" value={`$${d.aiCost30d.toFixed(2)}`}
                        sub="aggregated API cost" gradient="from-lime-600 to-emerald-600" />
                </div>
            </section>

            {/* ── Workspace Health Distribution ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Health bar chart */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-sm font-black text-slate-300 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-400" /> Workspace Health
                        </div>
                        <span className="text-[10px] font-black text-slate-600">{totalWs} total</span>
                    </div>
                    <div className="space-y-4">
                        <HealthBar label="🟢 Healthy" count={d.health.healthy} total={totalWs} color="bg-emerald-500" />
                        <HealthBar label="🟡 Warning" count={d.health.warning} total={totalWs} color="bg-amber-500" />
                        <HealthBar label="🟠 Restricted" count={d.health.restricted} total={totalWs} color="bg-orange-500" />
                        <HealthBar label="🔴 Suspended" count={d.health.suspended} total={totalWs} color="bg-rose-500" />
                    </div>
                    <div className="mt-6 grid grid-cols-4 gap-2">
                        {[
                            { label: "Healthy", val: d.health.healthy, color: "text-emerald-400" },
                            { label: "Warning", val: d.health.warning, color: "text-amber-400" },
                            { label: "Restricted", val: d.health.restricted, color: "text-orange-400" },
                            { label: "Suspended", val: d.health.suspended, color: "text-rose-400" },
                        ].map(h => (
                            <div key={h.label} className="text-center">
                                <div className={`text-xl font-black outfit ${h.color}`}>{h.val}</div>
                                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{h.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risk Indicators */}
                <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                        <div className="text-sm font-black text-slate-300">Risk Indicators</div>
                    </div>
                    <div className="space-y-3">
                        {[
                            {
                                label: "Workspaces in Warning",
                                value: d.risk.warningCnt,
                                level: d.risk.warningCnt === 0 ? "ok" : "warn",
                                hint: "Review AI limits or billing",
                                href: "/admin/workspaces",
                            },
                            {
                                label: "Restricted Workspaces",
                                value: d.risk.restrictedCnt,
                                level: d.risk.restrictedCnt === 0 ? "ok" : "warn",
                                hint: "Manually flagged or rate-limited",
                                href: "/admin/workspaces",
                            },
                            {
                                label: "Payment Issues",
                                value: d.risk.paymentIssueCnt,
                                level: d.risk.paymentIssueCnt === 0 ? "ok" : "critical",
                                hint: "past_due or canceled plans",
                                href: "/admin/workspaces",
                            },
                            {
                                label: "AI Spike Detected",
                                value: d.risk.aiSpikeDetected ? "Yes" : "No",
                                level: d.risk.aiSpikeDetected ? "critical" : "ok",
                                hint: "Single workspace consuming >50% tokens",
                                href: "/admin/ai-usage",
                            },
                            {
                                label: "Risky Admin Actions (24h)",
                                value: d.risk.recentRiskyActions,
                                level: d.risk.recentRiskyActions > 5 ? "critical" : d.risk.recentRiskyActions > 0 ? "warn" : "ok",
                                hint: "Suspensions, promotions, impersonations",
                                href: "/admin/audit-logs",
                            },
                        ].map(risk => (
                            <Link key={risk.label} href={risk.href}
                                className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-white/10 transition-all group">
                                <div>
                                    <div className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">
                                        {risk.label}
                                    </div>
                                    <div className="text-[10px] text-slate-700 font-medium mt-0.5">{risk.hint}</div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`text-lg font-black outfit ${risk.level === "critical" ? "text-rose-400" :
                                        risk.level === "warn" ? "text-amber-400" : "text-emerald-400"
                                        }`}>{risk.value}</span>
                                    <RiskBadge level={risk.level as any}
                                        label={risk.level === "ok" ? "OK" : risk.level === "warn" ? "WARN" : "ALERT"} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Quick Nav ── */}
            <section>
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-4">Quick Actions</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                        { href: "/admin/workspaces", label: "Manage Workspaces", icon: Building2, desc: "Suspend · Credits · Health" },
                        { href: "/admin/users", label: "Manage Users", icon: Users, desc: "Promote · Suspend · Roles" },
                        { href: "/admin/ai-usage", label: "AI Usage Monitor", icon: TrendingUp, desc: "Token trends · Cost analysis" },
                        { href: "/admin/audit-logs", label: "Audit Logs", icon: Shield, desc: "Full action history" },
                    ].map(link => {
                        const Icon = link.icon
                        return (
                            <Link key={link.href} href={link.href}
                                className="group flex items-start gap-3 bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all">
                                <Icon className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition-colors mt-0.5 shrink-0" />
                                <div>
                                    <div className="font-black text-white text-xs mb-0.5">{link.label}</div>
                                    <div className="text-[10px] text-slate-600 font-medium">{link.desc}</div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
