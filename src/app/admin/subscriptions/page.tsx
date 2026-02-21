"use client"

import { useState, useEffect } from "react"
import {
    CreditCard, TrendingUp, Users, AlertCircle,
    ArrowUpRight, ArrowDownRight, ExternalLink, RefreshCw,
    Search, Filter, ChevronDown, MoreHorizontal, Zap
} from "lucide-react"
import { MetricCard } from "@/components/admin/MetricCard"
import { motion } from "framer-motion"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts'
import { cn } from "@/lib/utils"

const REVENUE_DATA = [
    { name: 'Sep', mrr: 4200 },
    { name: 'Oct', mrr: 5800 },
    { name: 'Nov', mrr: 8100 },
    { name: 'Dec', mrr: 12400 },
    { name: 'Jan', mrr: 15900 },
    { name: 'Feb', mrr: 19200 },
]

const PLAN_DATA = [
    { name: 'Starter', value: 400, color: '#6366f1' },
    { name: 'Pro', value: 300, color: '#8b5cf6' },
    { name: 'Enterprise', value: 100, color: '#a855f7' },
]

type Subscription = {
    id: string
    name: string
    subscription_plan: string
    subscription_status: string
    createdAt: string
}

type Metrics = {
    mrr: number
    arr: number
    activeSubs: number
    trialSubs: number
    failedPayments: number
    churnRate: number
}

export default function SubscriptionsPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null)
    const [recentSubs, setRecentSubs] = useState<Subscription[]>([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        const res = await fetch("/api/admin/subscriptions")
        const data = await res.json()
        if (res.ok) {
            setMetrics(data.metrics)
            setRecentSubs(data.recentSubs)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    if (loading && !metrics) {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Billing Stack...</div>
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white outfit">Subscriptions</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1">Global Revenue & Billing Management</p>
                </div>
                <button onClick={load} className="p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 text-slate-400 hover:text-white transition-all">
                    <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Monthly Recurring Revenue"
                    value={`$${metrics?.mrr.toLocaleString()}`}
                    subValue="NET REVENUE AFTER CHURN"
                    icon={TrendingUp}
                    trend={{ value: "12.4%", isUp: true }}
                    gradient="from-emerald-500 to-teal-600"
                />
                <MetricCard
                    title="Active Subscriptions"
                    value={metrics?.activeSubs ?? 0}
                    subValue="PRO & ENTERPRISE TIERS"
                    icon={Users}
                    trend={{ value: "48", isUp: true }}
                    gradient="from-indigo-500 to-purple-600"
                />
                <MetricCard
                    title="ARR Projection"
                    value={`$${metrics?.arr.toLocaleString()}`}
                    subValue="ANNUALIZED RUN RATE"
                    icon={CreditCard}
                    gradient="from-blue-500 to-indigo-600"
                />
                <MetricCard
                    title="Revenue Churn"
                    value={`${metrics?.churnRate}%`}
                    subValue="LAST 30 DAYS"
                    icon={AlertCircle}
                    trend={{ value: "0.2%", isUp: false }}
                    gradient="from-rose-500 to-orange-600"
                />
            </div>

            {/* Visual Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-slate-900 border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-1">Revenue Trend</span>
                            <h3 className="text-lg font-black text-white outfit italic">MRR GROWTH / 6 MONTHS</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Gross MRR</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA}>
                                <defs>
                                    <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                                <YAxis stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} tickFormatter={(v: number) => `$${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ background: '#020617', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="mrr" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMrr)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 border border-white/5 rounded-3xl p-6">
                    <div className="mb-8">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest block mb-1">Tier Breakdown</span>
                        <h3 className="text-lg font-black text-white outfit italic">PLAN DISTRIBUTION</h3>
                    </div>
                    <div className="h-48 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PLAN_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {PLAN_DATA.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#020617', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {PLAN_DATA.map((p: any) => (
                            <div key={p.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{p.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{p.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                {/* Subscription Table */}
                <div className="xl:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Recent Conversions</span>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                                <input type="text" placeholder="Filter subscriptions..." className="bg-slate-900 border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-[11px] text-white focus:outline-none focus:border-indigo-500/50 w-48" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Workspace</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Plan</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSubs.map(sub => (
                                    <tr key={sub.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                                                    {sub.name[0]}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-white">{sub.name}</div>
                                                    <div className="text-[9px] text-slate-600 font-mono mt-0.5">{sub.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                {sub.subscription_plan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    sub.subscription_status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                                                )} />
                                                <span className="text-[10px] font-bold text-slate-400 capitalize">{sub.subscription_status}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-600 hover:text-white transition-all">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Billing Health Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertCircle className="h-4 w-4 text-rose-400" />
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Payment Issues</h3>
                            <span className="ml-auto px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[10px] font-black text-rose-400">
                                {metrics?.failedPayments} FLAG(S)
                            </span>
                        </div>

                        <div className="space-y-4">
                            {metrics?.failedPayments === 0 ? (
                                <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">All collections normal</p>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 font-bold leading-relaxed"> There are {metrics?.failedPayments} accounts with failed or unpaid statuses. Review these in Stripe immediately.</p>
                            )}

                            <button className="w-full py-2.5 bg-white text-black rounded-xl text-[11px] font-black uppercase hover:bg-slate-200 transition-all">
                                Open Stripe Dashboard
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
                        <Zap className="absolute -bottom-4 -right-4 h-24 w-24 text-indigo-500/10 rotate-12" />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Trial Conversions</h3>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-3xl font-black text-white outfit">{metrics?.trialSubs}</span>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1.5">Active Trials</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "65%" }}
                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                            />
                        </div>
                        <p className="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-tighter">65% project conversion rate based on historical data</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
