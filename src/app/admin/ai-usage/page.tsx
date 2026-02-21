"use client"

import { useState, useEffect } from "react"
import { BrainCircuit, RefreshCw, TrendingUp } from "lucide-react"

type AiData = {
    period_days: number
    total_tokens: number
    total_cost: number
    top_workspaces: { workspaceId: string; workspaceName: string; tokens_used: number; cost_estimate: number }[]
}

export default function AdminAiUsagePage() {
    const [data, setData] = useState<AiData | null>(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(30)

    const load = async () => {
        setLoading(true)
        const res = await fetch(`/api/admin/ai-usage?days=${days}`)
        const json = await res.json()
        setData(json)
        setLoading(false)
    }

    useEffect(() => { load() }, [days])

    const maxTokens = data?.top_workspaces?.[0]?.tokens_used ?? 1

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <BrainCircuit className="h-5 w-5 text-indigo-400" />
                    <h1 className="text-2xl font-black outfit text-white">AI Usage Monitor</h1>
                </div>
                <div className="flex items-center gap-3">
                    {[7, 30, 90].map(d => (
                        <button key={d} onClick={() => setDays(d)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${days === d ? "bg-indigo-600 border-indigo-500 text-white" : "border-white/5 text-slate-500 hover:text-white bg-white/[0.02]"}`}>
                            {d}d
                        </button>
                    ))}
                    <button onClick={load} className="p-2 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 text-slate-600 hover:text-white transition-all">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            {data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <TrendingUp className="h-5 w-5 text-indigo-400" />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Total Tokens ({days}d)</span>
                        </div>
                        <div className="text-4xl font-black outfit text-white">{(data.total_tokens / 1000).toFixed(1)}K</div>
                        <div className="text-sm text-slate-600 font-bold mt-1">{data.total_tokens.toLocaleString()} tokens</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg">💰</span>
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Est. Cost ({days}d)</span>
                        </div>
                        <div className="text-4xl font-black outfit text-white">${data.total_cost.toFixed(2)}</div>
                        <div className="text-sm text-slate-600 font-bold mt-1">estimated API cost</div>
                    </div>
                </div>
            )}

            {/* Top workspaces bar chart */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Top Workspaces by Token Usage</h2>
                {loading ? (
                    <div className="text-center py-10 text-slate-700 font-bold">Loading…</div>
                ) : data?.top_workspaces?.length === 0 ? (
                    <div className="text-center py-10 text-slate-700 font-bold">No AI usage data for this period.</div>
                ) : (
                    <div className="space-y-4">
                        {data?.top_workspaces?.map((ws, i) => (
                            <div key={ws.workspaceId}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-black text-white">{ws.workspaceName}</span>
                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                        <span>{(ws.tokens_used / 1000).toFixed(1)}K tokens</span>
                                        <span className="text-emerald-400">${ws.cost_estimate.toFixed(3)}</span>
                                    </div>
                                </div>
                                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.max(2, (ws.tokens_used / maxTokens) * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
