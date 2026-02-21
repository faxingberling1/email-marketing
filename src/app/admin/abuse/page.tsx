"use client"

import { useState, useEffect } from "react"
import {
    AlertOctagon, ShieldAlert, Zap, TrendingUp,
    Search, Ban, ShieldCheck, Flag, MoreHorizontal,
    Activity, Shield, MousePointer2
} from "lucide-react"
import { MetricCard } from "@/components/admin/MetricCard"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { cn } from "@/lib/utils"

type FlaggedWorkspace = {
    id: string
    name: string
    riskScore: number
    reasons: string[]
    bounceRate: string
    health_status: string
    total_ai_used: number
}

export default function AbuseDetectionPage() {
    const [data, setData] = useState<{ flaggedWorkspaces: FlaggedWorkspace[]; highRiskCount: number } | null>(null)
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        const res = await fetch("/api/admin/abuse")
        const json = await res.json()
        if (res.ok) setData(json)
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    if (loading && !data) {
        return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Platform for Anomalies...</div>
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white outfit">Abuse Detection</h1>
                <p className="text-slate-500 text-sm font-bold mt-1">Real-time Risk Analysis & Fraud Prevention</p>
            </div>

            {/* Risk Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="High-Risk Signals"
                    value={data?.highRiskCount ?? 0}
                    subValue="CRITICAL ANOMALIES"
                    icon={AlertOctagon}
                    trend={{ value: "2", isUp: true }}
                    gradient="from-rose-500 to-red-600"
                />
                <MetricCard
                    title="Avg Cloud Risk"
                    value="18.2"
                    subValue="PLATFORM HEALTH"
                    icon={ShieldCheck}
                    trend={{ value: "4.1%", isUp: false }}
                    gradient="from-emerald-500 to-teal-600"
                />
                <MetricCard
                    title="AI Spikes"
                    value="12"
                    subValue="LAST 6 HOURS"
                    icon={Zap}
                    gradient="from-amber-500 to-orange-600"
                />
                <MetricCard
                    title="System Shields"
                    value="Active"
                    subValue="AUTO-BLOCK ENABLED"
                    icon={Shield}
                    gradient="from-indigo-500 to-purple-600"
                />
            </div>

            {/* Main Risk Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest text-white">Flagged Workspaces</span>
                        <div className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[9px] font-black text-rose-500 uppercase tracking-widest">
                            Manual Review Required
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace / Identity</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Index</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Bounce Rate</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Anomalies</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Protection</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.flaggedWorkspaces.map(ws => (
                                <tr key={ws.id} className="group border-b border-white/[0.02] hover:bg-white/[0.02] transition-all">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs border transition-all group-hover:scale-105",
                                                ws.riskScore > 60 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-white/5 border-white/10 text-slate-400"
                                            )}>
                                                {ws.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white">{ws.name}</div>
                                                <div className="text-[10px] text-slate-600 font-mono mt-0.5">{ws.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-2 max-w-[120px]">
                                            <div className="flex items-center justify-between text-[10px] font-black mb-1">
                                                <span className={cn(
                                                    ws.riskScore > 60 ? "text-rose-500" : "text-amber-500"
                                                )}>{ws.riskScore}/100</span>
                                                <span className="text-slate-700 tracking-tighter">LVL {Math.ceil(ws.riskScore / 20)}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        ws.riskScore > 60 ? "bg-rose-500" : "bg-amber-500"
                                                    )}
                                                    style={{ width: `${ws.riskScore}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-3.5 w-3.5 text-slate-700" />
                                            <span className="text-xs font-bold text-slate-300">{ws.bounceRate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {ws.reasons.map(r => (
                                                <span key={r} className="px-2 py-0.5 bg-slate-800 border border-white/5 rounded text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                <ShieldCheck className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-500/10 rounded-xl text-slate-500 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20">
                                                <Ban className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visual Legend */}
                <div className="flex items-center gap-6 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Critical (&gt;60)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Warning (20-60)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-700" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Normal (&lt;20)</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2 italic">
                        <MousePointer2 className="h-3 w-3 text-slate-700" />
                        <span className="text-[10px] font-bold text-slate-700">Hover rows for defensive actions</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
