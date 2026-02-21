"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Users, Search, RefreshCw, Shield, UserX, UserCheck, ChevronUp,
    X, Loader2, Building2, Activity, Mail, Calendar, Key, UserIcon,
    ShieldAlert, Eye, ChevronDown
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type User = {
    id: string
    email: string
    name?: string
    global_role: string
    is_suspended: boolean
    auth_provider: string
    subscriptionPlan: string
    createdAt: string
    _count: { campaigns: number; contacts: number }
}

type DetailedUser = User & {
    image?: string
    updatedAt: string
    onboardingCompleted: boolean
    workspaceMemberships: {
        role: string
        workspace: {
            id: string
            name: string
            subscription_plan: string
            subscription_status: string
            health_status: string
        }
    }[]
}

type AuditLog = {
    id: string
    action_type: string
    target_type: string
    target_id: string
    created_at: string
    metadata: any
    actor: { name?: string; email: string }
}

// ── Action Panel (slide-in) ───────────────────────────────────────────────────

function ActionPanel({ userId, onClose, onRefresh }: {
    userId: string; onClose: () => void; onRefresh: () => void
}) {
    const [user, setUser] = useState<DetailedUser | null>(null)
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok })
        setTimeout(() => setToast(null), 3500)
    }

    const loadDetails = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/admin/users/${userId}`)
        const data = await res.json()
        if (res.ok) {
            setUser(data.user)
            setAuditLogs(data.auditLogs)
        } else {
            showToast(data.error ?? "Failed to load details", false)
        }
        setLoading(false)
    }, [userId])

    useEffect(() => { loadDetails() }, [loadDetails])

    const handleAction = async (action: "suspend" | "reactivate" | "promote" | "demote") => {
        setActionLoading(action)
        const res = await fetch(`/api/admin/users/${userId}/${action}`, { method: "POST" })
        const data = await res.json()
        setActionLoading(null)
        if (!res.ok) { showToast(data.error ?? "Action failed", false); return }
        showToast("Action completed successfully")
        loadDetails()
        onRefresh()
    }

    const handleImpersonate = async (workspaceId: string) => {
        setActionLoading("impersonate")
        const res = await fetch("/api/admin/impersonate/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workspaceId }),
        })
        if (res.ok) { window.location.href = "/dashboard" }
        else { showToast("Impersonation failed", false); setActionLoading(null) }
    }

    return (
        <div className="fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-[450px] bg-slate-950 border-l border-white/10 overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-indigo-400" />
                        <h2 className="font-black text-white outfit text-lg">User Profile</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-600">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="font-bold text-sm tracking-widest uppercase">Loading Genome…</span>
                    </div>
                ) : user ? (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Summary */}
                        <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black outfit text-white shrink-0">
                                {user.name?.[0] ?? user.email[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                                <div className="font-black text-white text-lg truncate">{user.name ?? "—"}</div>
                                <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    {user.global_role === "super_admin" ? (
                                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                            <Shield className="h-2.5 w-2.5" /> Admin
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-black text-slate-600 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-widest">User</span>
                                    )}
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${user.is_suspended ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                                        {user.is_suspended ? "Suspended" : "Active"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                            <Detail label="Provider" value={user.auth_provider} icon={Key} />
                            <Detail label="Joined" value={new Date(user.createdAt).toLocaleDateString()} icon={Calendar} />
                            <Detail label="Plan" value={user.subscriptionPlan} icon={Mail} />
                            <Detail label="Campaigns" value={user._count.campaigns.toString()} icon={Activity} />
                        </div>

                        {toast && (
                            <div className={`px-4 py-3 rounded-xl text-xs font-black text-center border
                                ${toast.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                                {toast.msg}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Safety & Access</div>
                            <div className="grid grid-cols-2 gap-3">
                                {user.is_suspended ? (
                                    <ActionBtn icon={UserCheck} label="Reactivate" loading={actionLoading === "reactivate"}
                                        onClick={() => handleAction("reactivate")} variant="success" />
                                ) : (
                                    <ActionBtn icon={UserX} label="Suspend" loading={actionLoading === "suspend"}
                                        onClick={() => handleAction("suspend")} variant="danger" />
                                )}
                                {user.global_role !== "super_admin" ? (
                                    <ActionBtn icon={ChevronUp} label="Promote" loading={actionLoading === "promote"}
                                        onClick={() => handleAction("promote")} variant="info" />
                                ) : (
                                    <ActionBtn icon={ShieldAlert} label="Demote" loading={actionLoading === "demote"}
                                        onClick={() => handleAction("demote")} variant="danger" />
                                )}
                            </div>
                        </div>

                        {/* Workspaces */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Workspace Memberships</div>
                                <span className="text-[10px] font-bold text-slate-800">{user.workspaceMemberships.length} total</span>
                            </div>
                            <div className="space-y-2">
                                {user.workspaceMemberships.length === 0 ? (
                                    <div className="text-center py-6 text-slate-700 text-xs font-bold border border-dashed border-white/5 rounded-2xl">No memberships found</div>
                                ) : (
                                    user.workspaceMemberships.map(m => (
                                        <div key={m.workspace.id} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl group hover:border-white/10 transition-all">
                                            <div className="min-w-0">
                                                <div className="font-black text-white text-xs truncate">{m.workspace.name}</div>
                                                <div className="text-[10px] text-slate-600 flex items-center gap-2 mt-0.5">
                                                    <span className="capitalize">{m.role}</span>
                                                    <span>•</span>
                                                    <span className="uppercase">{m.workspace.subscription_plan}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleImpersonate(m.workspace.id)}
                                                disabled={!!actionLoading}
                                                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black rounded-lg hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                                            >
                                                {actionLoading === "impersonate" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                                                Login
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Audit Logs */}
                        <div className="space-y-3 pb-6">
                            <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Recent Activity</div>
                            <div className="space-y-3">
                                {auditLogs.length === 0 ? (
                                    <div className="text-center py-6 text-slate-700 text-xs font-bold border border-dashed border-white/5 rounded-2xl">No recent history</div>
                                ) : (
                                    auditLogs.map(log => (
                                        <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1">
                                            <div className="absolute left-[-4.5px] top-1 h-2 w-2 rounded-full bg-slate-800 border border-white/10" />
                                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                <span>{log.action_type.replace(/_/g, " ")}</span>
                                                <span>{new Date(log.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 leading-relaxed italic">
                                                Target: {log.target_type} {log.target_id.slice(0, 8)}...
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </motion.div>
        </div>
    )
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center gap-3">
            <Icon className="h-3.5 w-3.5 text-slate-700 shrink-0" />
            <div className="min-w-0">
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{label}</div>
                <div className="text-slate-400 truncate">{value}</div>
            </div>
        </div>
    )
}

function ActionBtn({ icon: Icon, label, onClick, loading, variant }: {
    icon: any; label: string; onClick: () => void; loading: boolean; variant: "success" | "danger" | "info"
}) {
    const styles = {
        success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20",
        danger: "text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20",
        info: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20",
    }
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl font-black text-xs transition-all disabled:opacity-40 ${styles[variant]}`}
        >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
            {label}
        </button>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const limit = 25

    const load = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}&search=${search}`)
        const data = await res.json()
        setUsers(data.users ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
    }, [page, search])

    useEffect(() => { load() }, [load])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {selectedUserId && (
                    <ActionPanel
                        userId={selectedUserId}
                        onClose={() => setSelectedUserId(null)}
                        onRefresh={load}
                    />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <h1 className="text-2xl font-black outfit text-white">Genome Directory</h1>
                    <span className="px-2.5 py-1 bg-white/[0.05] border border-white/5 text-slate-500 text-[11px] font-black rounded-full">{total} users</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Find genome…"
                            className="bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-700 text-sm font-medium focus:border-indigo-500 focus:outline-none w-64" />
                    </div>
                    <button onClick={load} className="p-2 bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 text-slate-600 hover:text-white transition-all">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-3xl shadow-2xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.01]">
                            {["Genome", "Clearance", "Status", "Source", "Node Plan", "Actions"].map(h => (
                                <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-600 px-6 py-5">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-24 text-slate-700 font-bold uppercase tracking-[0.2em] text-xs">Syncing Directory…</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-24 text-slate-700 font-bold uppercase tracking-[0.2em] text-xs">No Genomes Detected</td></tr>
                        ) : users.map(user => (
                            <tr
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black outfit text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                                            {user.name?.[0] ?? user.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-black text-white text-sm group-hover:text-indigo-300 transition-colors">{user.name ?? "—"}</div>
                                            <div className="text-[10px] text-slate-600 font-mono">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {user.global_role === "super_admin" ? (
                                        <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                                            <Shield className="h-3 w-3" /> Admin
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-black text-slate-700 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-widest">User</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${user.is_suspended ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                                        {user.is_suspended ? "Suspended" : "Active"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-slate-500 font-black uppercase tracking-widest">{user.auth_provider}</td>
                                <td className="px-6 py-4">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user.subscriptionPlan}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedUserId(user.id) }}
                                        className="text-xs font-black text-slate-600 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
                                    >
                                        Inspect <ChevronDown className="h-3 w-3" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-2">
                    <span className="text-xs text-slate-600 font-bold uppercase tracking-widest">Segment {page} of {totalPages}</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-black bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/10 disabled:opacity-30 transition-all uppercase tracking-widest">← Previous</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-black bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/10 disabled:opacity-30 transition-all uppercase tracking-widest">Next →</button>
                    </div>
                </div>
            )}
        </div>
    )
}
