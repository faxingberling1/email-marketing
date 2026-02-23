"use client"

import {
    Search, Bell, Sparkles, ChevronDown, LogOut, Settings,
    Shield, Command, Zap, AlertTriangle, Building2, Plus,
    Globe, Terminal, Cpu, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "@/app/auth/actions"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
    createWorkspaceProtocol,
    allocateAiCreditsProtocol,
    broadcastAnnouncementProtocol,
    toggleMaintenanceModeProtocol,
    getWorkspacesProtocol
} from "@/app/admin/actions"
import { toast } from "sonner" // Assuming sonner is available for feedback

export function AdminHeader() {
    const { data: session } = useSession()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isActionOpen, setIsActionOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeProtocol, setActiveProtocol] = useState<string | null>(null)
    const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [notifInterval, setNotifInterval] = useState("1d")
    const [protocolData, setProtocolData] = useState<any>({})
    const [workspaces, setWorkspaces] = useState<{ id: string, name: string }[]>([])
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    useEffect(() => {
        if (activeProtocol === "Add AI Credits") {
            getWorkspacesProtocol().then(res => {
                if (res.success) setWorkspaces(res.workspaces || [])
            })
        }
    }, [activeProtocol])

    const executeProtocol = async () => {
        setIsPending(true)
        try {
            let res: any
            switch (activeProtocol) {
                case "Create Workspace":
                    res = await createWorkspaceProtocol(protocolData.name)
                    break
                case "Add AI Credits":
                    res = await allocateAiCreditsProtocol(protocolData.workspaceId, parseInt(protocolData.amount))
                    break
                case "Global Announcement":
                    res = await broadcastAnnouncementProtocol(protocolData.message)
                    break
                case "Maintenance Mode":
                    res = await toggleMaintenanceModeProtocol(protocolData.enabled)
                    break
            }

            if (res?.success) {
                toast.success(`${activeProtocol} protocol executed successfully.`)
                setIsProtocolModalOpen(false)
                setActiveProtocol(null)
                setProtocolData({})
            } else {
                toast.error(`Protocol failure: ${res?.error || 'Unknown error'}`)
            }
        } catch (err: any) {
            toast.error(`System error: ${err.message}`)
        } finally {
            setIsPending(false)
        }
    }

    const env = process.env.NODE_ENV === "production" ? "PROD" : "LOCAL"
    const envColor = env === "PROD" ? "bg-rose-500" : "bg-emerald-500"

    return (
        <header className={cn(
            "sticky top-0 z-40 w-full h-16 transition-all duration-300 border-b",
            scrolled
                ? "bg-slate-950/80 backdrop-blur-xl border-white/10 shadow-2xl"
                : "bg-transparent border-white/5"
        )}>
            <div className="h-full px-6 flex items-center justify-between gap-4">

                {/* Left: Branding & Env */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40 relative z-10">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            {/* Tactical Heartbeat */}
                            <div className="absolute inset-0 bg-indigo-500 rounded-xl animate-ping opacity-20 scale-125" />
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-white outfit tracking-tighter leading-none">PLATFORM OPS</span>
                                    <span className="text-[8px] font-black text-slate-500 tracking-[0.2em] leading-none mt-1 uppercase">HQ Control</span>
                                </div>
                                <div className={cn(
                                    "ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm",
                                    env === "PROD"
                                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                )}>
                                    <div className={cn("h-1 w-1 rounded-full animate-pulse", env === "PROD" ? "bg-rose-500" : "bg-emerald-500")} />
                                    <span className="text-[9px] font-black tracking-widest">{env}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Global Search */}
                <div className="flex-1 max-w-2xl hidden lg:block">
                    <div className={cn(
                        "relative group transition-all duration-300",
                        isSearchFocused ? "lg:mx-[-10px]" : ""
                    )}>
                        <Search className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors z-10",
                            isSearchFocused ? "text-indigo-400" : "text-slate-500"
                        )} />
                        <input
                            type="text"
                            placeholder="Execute global search protocol..."
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className={cn(
                                "w-full h-10 border rounded-xl pl-11 pr-16 text-xs text-white placeholder-slate-600 transition-all duration-500",
                                "bg-white/[0.02] border-white/5",
                                isSearchFocused
                                    ? "bg-indigo-500/[0.04] border-indigo-500/40 outline-none shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                    : "hover:bg-white/[0.04] hover:border-white/10"
                            )}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                            <div className="h-5 w-10 flex items-center justify-center rounded border border-white/10 bg-white/5 text-[10px] font-black text-slate-500 group-hover:border-white/20 transition-colors">
                                CMD K
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions & Cost Monitor */}
                <div className="flex items-center gap-3 shrink-0">

                    {/* AI Cost Badge */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/5 border border-indigo-500/10 rounded-full group cursor-default">
                        <Cpu className="h-3 w-3 text-indigo-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white">$142.30</span>
                            <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter">AI COST / 24H</span>
                        </div>
                    </div>

                    {/* Quick Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsActionOpen(!isActionOpen)}
                            className={cn(
                                "h-10 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 group",
                                "bg-white text-black hover:bg-indigo-50 shadow-lg shadow-white/5",
                                isActionOpen && "scale-95 bg-indigo-50"
                            )}
                        >
                            <Plus className={cn("h-4 w-4 transition-transform duration-300", isActionOpen && "rotate-45")} />
                            <span className="hidden sm:inline uppercase tracking-tighter">Mission Control</span>
                        </button>

                        <AnimatePresence>
                            {isActionOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsActionOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-20 overflow-hidden"
                                    >
                                        <div className="px-3 py-2">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Platform Ops</span>
                                        </div>
                                        {[
                                            { label: "Create Workspace", icon: Building2, color: "text-slate-300" },
                                            { label: "Add AI Credits", icon: Zap, color: "text-amber-400" },
                                            { label: "Global Announcement", icon: Globe, color: "text-indigo-400" },
                                            { label: "Maintenance Mode", icon: Terminal, color: "text-rose-400" },
                                        ].map(action => (
                                            <button
                                                key={action.label}
                                                onClick={() => {
                                                    setActiveProtocol(action.label)
                                                    setIsProtocolModalOpen(true)
                                                    setIsActionOpen(false)
                                                    if (action.label === "Maintenance Mode") {
                                                        setProtocolData({ enabled: false })
                                                    }
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group"
                                            >
                                                <action.icon className={cn("h-4 w-4", action.color)} />
                                                <span className="text-xs font-bold text-slate-300 group-hover:text-white">{action.label}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            className={cn(
                                "h-10 w-10 flex items-center justify-center border rounded-xl transition-all relative group",
                                isNotificationOpen
                                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                                    : "bg-white/[0.03] border-white/5 hover:border-white/10 text-slate-400 hover:text-white"
                            )}
                        >
                            <Bell className="h-5 w-5 transition-colors" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-slate-950 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                        </button>

                        <AnimatePresence>
                            {isNotificationOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-20 overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white outfit uppercase tracking-tight">Signal HUD</span>
                                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Platform Telemetry</span>
                                            </div>
                                            <div className="flex bg-slate-950 p-1 rounded-lg border border-white/5">
                                                {["1d", "7d", "14d", "30d"].map(iv => (
                                                    <button
                                                        key={iv}
                                                        onClick={() => setNotifInterval(iv)}
                                                        className={cn(
                                                            "px-2 py-1 text-[8px] font-black rounded-md transition-all uppercase tracking-tighter",
                                                            notifInterval === iv
                                                                ? "bg-indigo-600 text-white shadow-lg"
                                                                : "text-slate-600 hover:text-slate-400"
                                                        )}
                                                    >
                                                        {iv}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                                            {[
                                                { type: "security", label: "Security Alert", time: "2h ago", msg: "Brute force attempt detected on NODE-04", color: "text-rose-400", bg: "bg-rose-500/10" },
                                                { type: "system", label: "System Health", time: "5h ago", msg: "Memory optimization complete for Cluster B", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                                { type: "ai", label: "Neural Scaling", time: "12h ago", msg: "AI capacity expanded to meet 30d projection", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                                                { type: "workspace", label: "New Workspace", time: "1d ago", msg: "Enterprise workspace 'Sigma-9' provisioned", color: "text-purple-400", bg: "bg-purple-500/10" },
                                            ].filter(n => {
                                                if (notifInterval === "1d") return n.time.includes("ago") || n.time === "1d ago";
                                                return true; // Simple mock filter
                                            }).map((notif, i) => (
                                                <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                                    <div className={cn("h-8 w-8 rounded-lg shrink-0 flex items-center justify-center", notif.bg)}>
                                                        <AlertTriangle className={cn("h-4 w-4", notif.color)} />
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-[10px] font-black text-white outfit uppercase tracking-tight truncate">{notif.label}</span>
                                                            <span className="text-[8px] font-bold text-slate-600 shrink-0">{notif.time}</span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">{notif.msg}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full mt-4 py-2 border-t border-white/5 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">
                                            Archive All Signals
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile */}
                    <div className="relative border-l border-white/10 pl-3 ml-1">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-600/20 group hover:scale-105 transition-transform"
                        >
                            <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center text-xs font-black text-white group-hover:bg-transparent transition-all">
                                {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "A"}
                            </div>
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl z-20"
                                    >
                                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                                            <p className="text-xs font-black text-white truncate">{session?.user?.name ?? 'Super Admin'}</p>
                                            <p className="text-[10px] font-bold text-slate-500 truncate">{session?.user?.email}</p>
                                        </div>
                                        <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-slate-300">
                                            <Settings className="h-4 w-4" /> View Profile
                                        </Link>
                                        <Link href="/admin/security" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-xs font-bold text-slate-300">
                                            <Shield className="h-4 w-4" /> Security Settings
                                        </Link>
                                        <div className="mt-2 pt-2 border-t border-white/5">
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 transition-all text-xs font-bold text-rose-400"
                                            >
                                                <LogOut className="h-4 w-4" /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Admin Protocol Modal */}
            <AnimatePresence>
                {isProtocolModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProtocolModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 ring-1 ring-white/10">
                                        <Command className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white outfit uppercase tracking-tight">{activeProtocol}</h2>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Protocol Execution Interface</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {activeProtocol === "Create Workspace" && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Workspace Name</label>
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Enter intelligence container name..."
                                                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                                                onChange={(e) => setProtocolData({ ...protocolData, name: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {activeProtocol === "Add AI Credits" && (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Workspace</label>
                                                <select
                                                    className="w-full h-12 bg-slate-950 border border-white/10 rounded-2xl px-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                                                    onChange={(e) => setProtocolData({ ...protocolData, workspaceId: e.target.value })}
                                                >
                                                    <option value="">Select Workspace</option>
                                                    {workspaces.map(w => (
                                                        <option key={w.id} value={w.id}>{w.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Credit Units</label>
                                                <input
                                                    type="number"
                                                    placeholder="Unit quantity..."
                                                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                                                    onChange={(e) => setProtocolData({ ...protocolData, amount: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeProtocol === "Global Announcement" && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Transmission Content</label>
                                            <textarea
                                                autoFocus
                                                placeholder="Broadcast signal to all network nodes..."
                                                className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none"
                                                onChange={(e) => setProtocolData({ ...protocolData, message: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {activeProtocol === "Maintenance Mode" && (
                                        <div className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="space-y-1">
                                                <p className="text-sm font-black text-white">Toggle System Offline</p>
                                                <p className="text-[10px] font-bold text-slate-500">Restricts platform access to staff only.</p>
                                            </div>
                                            <button
                                                onClick={() => setProtocolData({ enabled: !protocolData.enabled })}
                                                className={cn(
                                                    "h-8 w-14 rounded-full transition-all duration-300 relative",
                                                    protocolData.enabled ? "bg-rose-500" : "bg-slate-700"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-6 w-6 bg-white rounded-full absolute top-1 transition-all duration-300",
                                                    protocolData.enabled ? "left-7" : "left-1"
                                                )} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setIsProtocolModalOpen(false)}
                                        className="flex-1 h-14 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        disabled={isPending}
                                        onClick={executeProtocol}
                                        className="flex-1 h-14 bg-white text-black hover:bg-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin text-black" />
                                                <span>Executing...</span>
                                            </>
                                        ) : (
                                            "Confirm Protocol"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    )
}
