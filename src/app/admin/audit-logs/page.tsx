"use client"

import { useState, useEffect, useCallback } from "react"
import { ScrollText, RefreshCw, Filter } from "lucide-react"

type AuditLog = {
    id: string
    action_type: string
    target_type: string
    target_id: string
    metadata: Record<string, unknown>
    created_at: string
    actor: { id: string; name?: string; email: string }
}

const ACTION_COLORS: Record<string, string> = {
    WORKSPACE_SUSPENDED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    WORKSPACE_REACTIVATED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    WORKSPACE_CREDITS_ADDED: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    WORKSPACE_LIMITS_RESET: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    WORKSPACE_HEALTH_CHANGED: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    USER_SUSPENDED: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    USER_REACTIVATED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    USER_PROMOTED: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    USER_DEMOTED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    IMPERSONATION_STARTED: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    IMPERSONATION_ENDED: "text-slate-400 bg-slate-500/10 border-slate-500/20",
}

const ACTION_TYPES = [
    "All", "WORKSPACE_SUSPENDED", "WORKSPACE_REACTIVATED", "WORKSPACE_CREDITS_ADDED",
    "WORKSPACE_LIMITS_RESET", "WORKSPACE_HEALTH_CHANGED", "USER_SUSPENDED", "USER_REACTIVATED",
    "USER_PROMOTED", "USER_DEMOTED", "IMPERSONATION_STARTED", "IMPERSONATION_ENDED",
]

export default function AdminAuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [filterAction, setFilterAction] = useState("All")
    const limit = 50

    const load = useCallback(async () => {
        setLoading(true)
        const action = filterAction !== "All" ? `&action=${filterAction}` : ""
        const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=${limit}${action}`)
        const data = await res.json()
        setLogs(data.logs ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
    }, [page, filterAction])

    useEffect(() => { load() }, [load])

    const totalPages = Math.ceil(total / limit)

    return (
        <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <ScrollText className="h-5 w-5 text-indigo-400" />
                    <h1 className="text-2xl font-black outfit text-white">Audit Logs</h1>
                    <span className="px-2.5 py-1 bg-white/[0.05] border border-white/5 text-slate-500 text-[11px] font-black rounded-full">{total}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-600" />
                        <select value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(1) }}
                            className="bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:border-indigo-500 focus:outline-none">
                            {ACTION_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <button onClick={load} className="p-2 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 text-slate-600 hover:text-white transition-all">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5">
                            {["Timestamp", "Actor", "Action", "Target", "Metadata"].map(h => (
                                <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-600 px-5 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-16 text-slate-700 font-bold">Loading…</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-16 text-slate-700 font-bold">No audit logs yet</td></tr>
                        ) : logs.map(log => (
                            <tr key={log.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                <td className="px-5 py-4">
                                    <div className="text-xs font-bold text-slate-400">{new Date(log.created_at).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-slate-700">{new Date(log.created_at).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="text-xs font-black text-white">{log.actor.name ?? log.actor.email}</div>
                                    <div className="text-[10px] text-slate-600">{log.actor.email}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border whitespace-nowrap ${ACTION_COLORS[log.action_type] ?? "text-slate-400 bg-white/5 border-white/5"}`}>
                                        {log.action_type}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="text-xs font-bold text-slate-400 capitalize">{log.target_type}</div>
                                    <div className="text-[10px] text-slate-700 font-mono">{log.target_id.slice(0, 12)}…</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="text-[10px] text-slate-600 font-mono max-w-xs truncate">
                                        {JSON.stringify(log.metadata)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-600 font-bold">Page {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-black bg-white/[0.03] border border-white/5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30 transition-all">←</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-black bg-white/[0.03] border border-white/5 rounded-lg text-slate-500 hover:text-white disabled:opacity-30 transition-all">→</button>
                    </div>
                </div>
            )}
        </div>
    )
}
