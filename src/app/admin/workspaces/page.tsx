"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Building2, Search, RefreshCw, ChevronDown, CheckCircle, AlertTriangle,
    XCircle, Shield, Zap, Mail, CreditCard, Eye, Trash2, RotateCcw, X,
    BanIcon, ChevronUp, Loader2
} from "lucide-react"

type Workspace = {
    id: string
    name: string
    subscription_plan: string
    subscription_status: string
    ai_credits_remaining: number
    email_limit_remaining: number
    total_ai_used: number
    total_emails_sent: number
    health_status: string
    deleted_at: string | null
    createdAt: string
    owner: { id: string; name?: string; email: string } | null
    _count: { members: number }
}

const HEALTH_STYLES: Record<string, { badge: string; icon: React.ElementType }> = {
    healthy: { badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle },
    warning: { badge: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
    restricted: { badge: "text-orange-400 bg-orange-500/10 border-orange-500/20", icon: AlertTriangle },
    suspended: { badge: "text-rose-400 bg-rose-500/10 border-rose-500/20", icon: XCircle },
}

const STATUS_STYLES: Record<string, string> = {
    active: "text-emerald-400",
    trialing: "text-sky-400",
    past_due: "text-amber-400",
    canceled: "text-rose-400",
    unpaid: "text-rose-400",
}

const PLANS = ["free", "starter", "pro", "enterprise"]
const HEALTH_OPTIONS = ["healthy", "warning", "restricted", "suspended"]

// ── Action Panel (slide-in) ───────────────────────────────────────────────────

function ActionPanel({ ws, onClose, onRefresh }: {
    ws: Workspace; onClose: () => void; onRefresh: () => void
}) {
    const [loading, setLoading] = useState<string | null>(null)
    const [credits, setCredits] = useState("")
    const [newPlan, setNewPlan] = useState(ws.subscription_plan)
    const [newStatus, setNewStatus] = useState(ws.subscription_status)
    const [newHealth, setNewHealth] = useState(ws.health_status)
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok })
        setTimeout(() => setToast(null), 3500)
    }

    const call = async (path: string, method: string, body?: object, headers?: Record<string, string>) => {
        setLoading(path)
        const res = await fetch(`/api/admin/workspaces/${ws.id}/${path}`, {
            method, headers: { "Content-Type": "application/json", ...headers },
            body: body ? JSON.stringify(body) : undefined,
        })
        const data = await res.json()
        setLoading(null)
        if (!res.ok) { showToast(data.error ?? "Error", false); return null }
        return data
    }

    const handleSuspend = async () => {
        const r = await call("suspend", "POST")
        if (r) { showToast("Workspace suspended"); onRefresh() }
    }
    const handleReactivate = async () => {
        const r = await call("reactivate", "POST")
        if (r) { showToast("Workspace reactivated"); onRefresh() }
    }
    const handleResetLimits = async () => {
        const r = await call("reset-limits", "POST")
        if (r) { showToast("Limits reset to defaults"); onRefresh() }
    }
    const handleAddCredits = async () => {
        const n = parseInt(credits)
        if (!n || n < 1) { showToast("Enter a valid credit amount", false); return }
        const r = await call("credits", "POST", { credits: n })
        if (r) { showToast(`+${n} credits added`); setCredits(""); onRefresh() }
    }
    const handleChangePlan = async () => {
        const r = await call("change-plan", "PATCH", { plan: newPlan, status: newStatus })
        if (r) { showToast("Plan updated"); onRefresh() }
    }
    const handleChangeHealth = async () => {
        const r = await call("health", "PATCH", { health_status: newHealth })
        if (r) { showToast("Health status updated"); onRefresh() }
    }
    const handleImpersonate = async () => {
        setLoading("impersonate")
        const res = await fetch("/api/admin/impersonate/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workspaceId: ws.id }),
        })
        setLoading(null)
        if (res.ok) { window.location.href = "/dashboard" }
        else showToast("Impersonation failed", false)
    }
    const handleDelete = async () => {
        setDeleteLoading(true)
        const isPaidActive = ws.subscription_status === "active" && ws.subscription_plan !== "free"
        const headers: Record<string, string> = {}
        if (isPaidActive) headers["x-confirm-delete"] = "CONFIRM"

        const res = await fetch(`/api/admin/workspaces/${ws.id}`, {
            method: "DELETE",
            headers,
        })
        const data = await res.json()
        setDeleteLoading(false)

        if (!res.ok) { showToast(data.error ?? "Delete failed", false); return }
        showToast("Workspace soft-deleted")
        setTimeout(() => { onClose(); onRefresh() }, 1000)
    }

    return (
        <div className="fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="w-96 bg-slate-950 border-l border-white/10 overflow-y-auto flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-white/5">
                    <div>
                        <div className="font-black text-white outfit text-lg">{ws.name}</div>
                        <div className="text-xs text-slate-600 font-mono mt-0.5">{ws.id}</div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors mt-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Toast */}
                {toast && (
                    <div className={`mx-4 mt-4 px-4 py-3 rounded-xl text-sm font-bold text-center border
                        ${toast.ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"}`}>
                        {toast.msg}
                    </div>
                )}

                {/* Suspension notice */}
                {ws.health_status === "suspended" && (
                    <div className="mx-4 mt-4 flex items-center gap-2 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-black text-rose-400 uppercase tracking-widest">
                        <BanIcon className="h-3.5 w-3.5 shrink-0" />
                        Workspace Suspended — Login, AI &amp; Sending Blocked
                    </div>
                )}

                <div className="p-4 space-y-3 flex-1">

                    {/* Workspace info */}
                    <Section title="Status">
                        <InfoRow label="Health">
                            {(() => {
                                const s = HEALTH_STYLES[ws.health_status] ?? HEALTH_STYLES.warning
                                const Icon = s.icon
                                return (
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${s.badge}`}>
                                        <Icon className="h-3 w-3" />{ws.health_status}
                                    </span>
                                )
                            })()}
                        </InfoRow>
                        <InfoRow label="Plan"><span className="text-xs font-black text-white uppercase">{ws.subscription_plan}</span></InfoRow>
                        <InfoRow label="Billing"><span className={`text-xs font-black ${STATUS_STYLES[ws.subscription_status] ?? "text-slate-400"}`}>{ws.subscription_status}</span></InfoRow>
                        <InfoRow label="AI Credits"><span className="text-xs font-bold text-slate-400">{ws.ai_credits_remaining.toLocaleString()}</span></InfoRow>
                        <InfoRow label="Email Limit"><span className="text-xs font-bold text-slate-400">{ws.email_limit_remaining.toLocaleString()}</span></InfoRow>
                    </Section>

                    {/* Suspend / Reactivate */}
                    <Section title="Access Control">
                        {ws.health_status === "suspended" ? (
                            <ActionBtn icon={CheckCircle} label="Reactivate Workspace" loading={loading === "reactivate"}
                                onClick={handleReactivate} variant="success" />
                        ) : (
                            <ActionBtn icon={BanIcon} label="Suspend Workspace" loading={loading === "suspend"}
                                onClick={handleSuspend} variant="danger"
                                hint="Blocks login, AI requests &amp; email sending" />
                        )}
                    </Section>

                    {/* Credits & Limits */}
                    <Section title="Credits & Limits">
                        <div className="flex gap-2">
                            <input value={credits} onChange={e => setCredits(e.target.value)}
                                placeholder="Credits to add" type="number" min={1} max={1000000}
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-indigo-500" />
                            <button onClick={handleAddCredits} disabled={!!loading}
                                className="px-3 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-black rounded-xl hover:bg-indigo-500/30 transition-all disabled:opacity-40">
                                {loading === "credits" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Add"}
                            </button>
                        </div>
                        <ActionBtn icon={RotateCcw} label="Reset Limits to Default" loading={loading === "reset-limits"}
                            onClick={handleResetLimits} variant="neutral"
                            hint="Sets AI credits → 100, Email limit → 500" />
                    </Section>

                    {/* Change Plan */}
                    <Section title="Subscription Plan">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest block mb-1">Plan</label>
                                    <select value={newPlan} onChange={e => setNewPlan(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500">
                                        {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest block mb-1">Status</label>
                                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500">
                                        {["active", "trialing", "past_due", "canceled", "unpaid"].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleChangePlan} disabled={!!loading}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-slate-300 text-xs font-black hover:bg-white/[0.06] transition-all disabled:opacity-40">
                                {loading === "change-plan" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
                                Apply Plan Change
                            </button>
                        </div>
                    </Section>

                    {/* Health Status */}
                    <Section title="Health Status">
                        <div className="flex gap-2">
                            <select value={newHealth} onChange={e => setNewHealth(e.target.value)}
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500">
                                {HEALTH_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <button onClick={handleChangeHealth} disabled={!!loading}
                                className="px-3 py-2 bg-white/[0.04] border border-white/10 text-slate-300 text-xs font-black rounded-xl hover:bg-white/[0.06] disabled:opacity-40">
                                {loading === "health" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Set"}
                            </button>
                        </div>
                    </Section>

                    {/* Impersonate */}
                    <Section title="Impersonation">
                        <ActionBtn icon={Eye} label="Impersonate Workspace" loading={loading === "impersonate"}
                            onClick={handleImpersonate} variant="info"
                            hint="Opens dashboard as this workspace with visible banner" />
                    </Section>

                    {/* Danger Zone */}
                    <Section title="Danger Zone" danger>
                        {!deleteConfirm ? (
                            <ActionBtn icon={Trash2} label="Soft Delete Workspace" loading={false}
                                onClick={() => setDeleteConfirm(true)} variant="danger"
                                hint="Sets deleted_at — data is preserved" />
                        ) : (
                            <div className="space-y-2">
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 font-bold">
                                    {ws.subscription_status === "active" && ws.subscription_plan !== "free"
                                        ? `⚠️ Active paid workspace (${ws.subscription_plan}). This action will be logged. Are you sure?`
                                        : "This workspace will be soft-deleted. Data is preserved but all access is blocked."}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setDeleteConfirm(false)}
                                        className="flex-1 py-2 text-xs font-black text-slate-500 hover:text-white border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                        Cancel
                                    </button>
                                    <button onClick={handleDelete} disabled={deleteLoading}
                                        className="flex-1 py-2 text-xs font-black text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl hover:bg-rose-500/20 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5">
                                        {deleteLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </Section>
                </div>
            </div>
        </div>
    )
}

// ── Helper components ─────────────────────────────────────────────────────────

function Section({ title, children, danger = false }: { title: string; children: React.ReactNode; danger?: boolean }) {
    return (
        <div className={`rounded-xl border p-4 space-y-3 ${danger ? "border-rose-500/10 bg-rose-500/[0.03]" : "border-white/[0.05] bg-white/[0.02]"}`}>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${danger ? "text-rose-600" : "text-slate-700"}`}>{title}</div>
            {children}
        </div>
    )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest shrink-0">{label}</span>
            {children}
        </div>
    )
}

function ActionBtn({ icon: Icon, label, hint, onClick, loading, variant }: {
    icon: React.ElementType; label: string; hint?: string; onClick: () => void
    loading: boolean; variant: "success" | "danger" | "neutral" | "info"
}) {
    const styles = {
        success: "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
        danger: "text-rose-400 border-rose-500/20 hover:bg-rose-500/10",
        neutral: "text-slate-300 border-white/10 hover:bg-white/[0.04]",
        info: "text-sky-400 border-sky-500/20 hover:bg-sky-500/10",
    }
    return (
        <button onClick={onClick} disabled={loading}
            className={`w-full flex items-start gap-3 px-3 py-2.5 border rounded-xl transition-all disabled:opacity-40 ${styles[variant]}`}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mt-0.5 shrink-0" /> : <Icon className="h-4 w-4 mt-0.5 shrink-0" />}
            <div className="text-left">
                <div className="text-xs font-black">{label}</div>
                {hint && <div className="text-[10px] text-slate-600 font-medium mt-0.5">{hint}</div>}
            </div>
        </button>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminWorkspacesPage() {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [selectedWs, setSelectedWs] = useState<Workspace | null>(null)
    const [showDeleted, setShowDeleted] = useState(false)
    const limit = 20

    const load = useCallback(async () => {
        setLoading(true)
        const params = new URLSearchParams({
            page: String(page), limit: String(limit),
            search, ...(showDeleted ? { include_deleted: "1" } : {}),
        })
        const res = await fetch(`/api/admin/workspaces?${params}`)
        const data = await res.json()
        setWorkspaces(data.workspaces ?? [])
        setTotal(data.total ?? 0)
        setLoading(false)
    }, [page, search, showDeleted])

    useEffect(() => { load() }, [load])

    const totalPages = Math.ceil(total / limit)

    return (
        <div>
            {selectedWs && (
                <ActionPanel ws={selectedWs} onClose={() => setSelectedWs(null)} onRefresh={load} />
            )}

            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-indigo-400" />
                    <h1 className="text-2xl font-black outfit text-white">Workspaces</h1>
                    <span className="px-2.5 py-1 bg-white/[0.05] border border-white/5 text-slate-500 text-[11px] font-black rounded-full">{total}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-bold cursor-pointer">
                        <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)}
                            className="accent-indigo-500" />
                        Show deleted
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search workspaces…"
                            className="bg-slate-900/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-700 text-sm font-medium focus:border-indigo-500 focus:outline-none w-56" />
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
                            {["Workspace", "Owner", "Plan / Status", "Health", "AI Credits", "Members", "Actions"].map(h => (
                                <th key={h} className="text-left text-[10px] font-black uppercase tracking-widest text-slate-600 px-5 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-16 text-slate-700 font-bold">Loading…</td></tr>
                        ) : workspaces.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-16 text-slate-700 font-bold">No workspaces found</td></tr>
                        ) : workspaces.map(ws => {
                            const hStyle = HEALTH_STYLES[ws.health_status] ?? HEALTH_STYLES.warning
                            const HIcon = hStyle.icon
                            const isDeleted = !!ws.deleted_at
                            return (
                                <tr key={ws.id}
                                    className={`border-b border-white/[0.03] transition-colors
                                        ${isDeleted ? "opacity-40" : "hover:bg-white/[0.02]"}`}>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <div className="font-black text-white">{ws.name}</div>
                                                <div className="text-[10px] text-slate-600 font-mono">{ws.id.slice(0, 14)}…</div>
                                            </div>
                                            {isDeleted && <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded">Deleted</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-400 font-bold text-xs max-w-[120px] truncate">
                                        {ws.owner?.name ?? ws.owner?.email ?? "—"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="text-xs font-black text-white uppercase">{ws.subscription_plan}</div>
                                        <div className={`text-[10px] font-bold ${STATUS_STYLES[ws.subscription_status] ?? "text-slate-600"}`}>{ws.subscription_status}</div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${hStyle.badge}`}>
                                            <HIcon className="h-3 w-3" />{ws.health_status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-400 font-bold text-xs">{ws.ai_credits_remaining.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-slate-400 font-bold text-xs">{ws._count.members}</td>
                                    <td className="px-5 py-4">
                                        <button onClick={() => setSelectedWs(ws)} disabled={isDeleted}
                                            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-white bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-xl hover:border-indigo-500/30 disabled:opacity-30 transition-all">
                                            Actions <ChevronDown className="h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-600 font-bold">Page {page} of {totalPages} · {total} workspaces</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs font-black bg-white/[0.03] border border-white/5 rounded-lg text-slate-500 hover:text-white hover:border-white/10 disabled:opacity-30 transition-all">←</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs font-black bg-white/[0.03] border border-white/5 rounded-lg text-slate-500 hover:text-white hover:border-white/10 disabled:opacity-30 transition-all">→</button>
                    </div>
                </div>
            )}
        </div>
    )
}
