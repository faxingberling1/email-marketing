"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Building2, Search, RefreshCw, ChevronDown, CheckCircle, AlertTriangle,
    XCircle, Shield, Zap, Mail, CreditCard, Eye, Trash2, RotateCcw, X,
    BanIcon, Crown, Loader2, Award, Calculator, DollarSign
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
    _count: { members: number; contacts: number }
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

const PLANS = ["free", "starter", "growth", "pro", "enterprise"]
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

    // Cost Calculator State
    const [calcCredits, setCalcCredits] = useState("")
    const [calcEmails, setCalcEmails] = useState("")
    const [calcContacts, setCalcContacts] = useState("")

    const estimatedCost = (
        (parseInt(calcCredits || "0") / 1000) * 0.50 +
        (parseInt(calcEmails || "0") / 10000) * 2.00 +
        (parseInt(calcContacts || "0") / 1000) * 15.00
    ).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
                <div className="flex items-start justify-between p-6 border-b border-indigo-500/20 bg-indigo-500/5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Crown className="h-4 w-4 text-amber-400" />
                            <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Enterprise VIP</div>
                        </div>
                        <div className="font-black text-white outfit text-lg">{ws.name}</div>
                        <div className="text-xs text-slate-600 font-mono mt-0.5">{ws.id}</div>
                    </div>
                    <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors mt-1 hover:bg-white/10 p-1 rounded-md">
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

                    {/* Enterprise SLA */}
                    <Section title="Enterprise SLA" highlighted>
                        <InfoRow label="Dedicated Manager"><span className="text-xs font-black text-indigo-400">Assigned (Auto)</span></InfoRow>
                        <InfoRow label="Support Tier"><span className="text-xs font-black text-amber-400">24/7 Priority</span></InfoRow>
                        <InfoRow label="Custom Limits"><span className="text-xs font-black text-emerald-400">Active</span></InfoRow>
                    </Section>

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
                        <InfoRow label="AI Used">
                            <span className="text-xs font-bold text-slate-400">
                                {ws.total_ai_used.toLocaleString()} / {(ws.total_ai_used + ws.ai_credits_remaining).toLocaleString()}
                            </span>
                        </InfoRow>
                        <InfoRow label="Email Sent">
                            <span className="text-xs font-bold text-slate-400">
                                {ws.total_emails_sent.toLocaleString()} / {(ws.total_emails_sent + ws.email_limit_remaining).toLocaleString()}
                            </span>
                        </InfoRow>
                        <InfoRow label="Contacts">
                            <span className="text-xs font-bold text-slate-400">
                                {ws._count.contacts.toLocaleString()}
                            </span>
                        </InfoRow>
                    </Section>

                    {/* Suspend / Reactivate */}
                    <Section title="Access Control">
                        {ws.health_status === "suspended" ? (
                            <ActionBtn icon={CheckCircle} label="Reactivate Enterprise Account" loading={loading === "reactivate"}
                                onClick={handleReactivate} variant="success" />
                        ) : (
                            <ActionBtn icon={BanIcon} label="Suspend Enterprise Account" loading={loading === "suspend"}
                                onClick={handleSuspend} variant="danger"
                                hint="Requires Executive Override Approval" />
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
                            hint="Sets AI credits → 100k, Email limits → 10M" />
                    </Section>

                    {/* Custom Quota Calculator */}
                    <Section title="Quota Cost Estimator" highlighted>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Additional AI Credits ($0.50 / 1k)</label>
                                <input value={calcCredits} onChange={e => setCalcCredits(e.target.value)} type="number" placeholder="e.g. 50000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-amber-500/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Additional Email Volume ($2.00 / 10k)</label>
                                <input value={calcEmails} onChange={e => setCalcEmails(e.target.value)} type="number" placeholder="e.g. 1000000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-amber-500/50 transition-colors" />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Additional Contacts ($15.00 / 1k)</label>
                                <input value={calcContacts} onChange={e => setCalcContacts(e.target.value)} type="number" placeholder="e.g. 50000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-slate-700 focus:outline-none focus:border-amber-500/50 transition-colors" />
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Calculator className="h-3.5 w-3.5 text-amber-500 shrink-0" /> Estimated MRR Impact
                                </div>
                                <div className="text-lg font-black text-white outfit flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-emerald-400 shrink-0" />{estimatedCost} <span className="text-[10px] text-slate-500 uppercase mt-1">/ mo</span>
                                </div>
                            </div>
                        </div>
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
                                        ? `⚠️ Active Enterprise workspace (${ws.subscription_plan}). This action triggers an executive alert. Are you sure?`
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

function Section({ title, children, danger = false, highlighted = false }: { title: string; children: React.ReactNode; danger?: boolean; highlighted?: boolean }) {
    let style = "border-white/[0.05] bg-white/[0.02]"
    let titleStyle = "text-slate-700"

    if (danger) {
        style = "border-rose-500/10 bg-rose-500/[0.03]"
        titleStyle = "text-rose-600"
    } else if (highlighted) {
        style = "border-amber-500/20 bg-amber-500/[0.05] shadow-[0_0_15px_rgba(245,158,11,0.05)]"
        titleStyle = "text-amber-500"
    }

    return (
        <div className={`rounded-xl border p-4 space-y-3 ${style}`}>
            <div className={`text-[9px] font-black uppercase tracking-[0.2em] ${titleStyle}`}>{title}</div>
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

export default function AdminEnterprisePage() {
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
            search, plan: "enterprise", ...(showDeleted ? { include_deleted: "1" } : {}),
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
        <div className="space-y-8 pb-12">
            {selectedWs && (
                <ActionPanel ws={selectedWs} onClose={() => setSelectedWs(null)} onRefresh={load} />
            )}

            {/* Premium Header */}
            <div className="relative rounded-[2rem] border border-amber-500/20 bg-amber-500/5 p-8 overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Shield className="h-32 w-32 text-amber-500" />
                </div>

                <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(251,191,36,0.4)]">
                        <Crown className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black outfit text-white tracking-tight">Enterprise Command</h1>
                        <p className="text-[11px] font-black text-amber-400 uppercase tracking-widest mt-1">Tier-1 Client Management & SLAs</p>
                    </div>
                </div>

                <p className="text-sm font-bold text-slate-400 max-w-2xl leading-relaxed">
                    This sector is restricted to Enterprise operations. Monitor SLA health, manage dedicated limits, and oversee all platform usage for VIP accounts.
                </p>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-xl font-black outfit text-white">VIP Roster</h2>
                    <span className="px-2.5 py-1 bg-white/[0.05] border border-white/5 text-slate-500 text-[11px] font-black rounded-full">{total}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <label className="flex items-center gap-2 text-xs text-slate-600 font-bold cursor-pointer hover:text-white transition-colors">
                        <input type="checkbox" checked={showDeleted} onChange={e => setShowDeleted(e.target.checked)}
                            className="accent-indigo-500" />
                        Show soft-deleted
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search high-value accounts…"
                            className="bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 text-xs font-bold focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 focus:outline-none w-64 transition-all" />
                    </div>
                    <button onClick={load} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/[0.05] hover:border-white/10 text-slate-500 hover:text-white transition-all">
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-black/40">
                            {["Account", "Owner", "Status", "Health", "AI Cap", "Audience", "Delegates", "Actions"].map(h => (
                                <th key={h} className="text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 px-6 py-4">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-16 text-slate-600 font-bold uppercase tracking-widest text-xs">Loading VIP Roster…</td></tr>
                        ) : workspaces.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-16 text-slate-600 font-bold uppercase tracking-widest text-xs">No Enterprise Accounts Onboarded</td></tr>
                        ) : workspaces.map(ws => {
                            const hStyle = HEALTH_STYLES[ws.health_status] ?? HEALTH_STYLES.warning
                            const HIcon = hStyle.icon
                            const isDeleted = !!ws.deleted_at
                            return (
                                <tr key={ws.id}
                                    className={`transition-colors
                                        ${isDeleted ? "opacity-30" : "hover:bg-white/[0.02]"}`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                                <Crown className="h-4 w-4 text-amber-500" />
                                            </div>
                                            <div>
                                                <div className="font-black text-white text-sm">{ws.name}</div>
                                                <div className="text-[10px] text-slate-500 font-mono tracking-wider">{ws.id.slice(0, 14)}…</div>
                                            </div>
                                            {isDeleted && <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded ml-2">Archived</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 font-bold text-xs max-w-[120px] truncate">
                                        {ws.owner?.name ?? ws.owner?.email ?? "—"}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1 items-start">
                                            <div className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-widest border border-amber-500/20">{ws.subscription_plan}</div>
                                            <div className={`text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[ws.subscription_status] ?? "text-slate-600"}`}>{ws.subscription_status}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${hStyle.badge}`}>
                                            <HIcon className="h-3 w-3" />{ws.health_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-300 font-black text-xs">{ws.ai_credits_remaining.toLocaleString()}</td>
                                    <td className="px-6 py-5 text-slate-300 font-black text-xs">{ws._count.contacts.toLocaleString()}</td>
                                    <td className="px-6 py-5 text-slate-300 font-black text-xs">{ws._count.members}</td>
                                    <td className="px-6 py-5">
                                        <button onClick={() => setSelectedWs(ws)} disabled={isDeleted}
                                            className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-white bg-black/40 border border-white/10 px-4 py-2 rounded-xl hover:border-amber-500/40 hover:bg-amber-500/10 transition-all disabled:opacity-30 group">
                                            Manage <ChevronDown className="h-3 w-3 text-slate-600 transition-colors group-hover:text-amber-500" />
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
                    <span className="text-[10px] tracking-widest uppercase text-slate-500 font-black">Page {page} of {totalPages} — {total} VIP Accounts</span>
                    <div className="flex gap-2">
                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 text-xs font-black bg-white/[0.02] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all">← PREV</button>
                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 text-xs font-black bg-white/[0.02] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 transition-all">NEXT →</button>
                    </div>
                </div>
            )}
        </div>
    )
}
