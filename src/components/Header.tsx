"use client"

import { Bell, Search, Mail, Sparkles, ChevronDown, LogOut, Settings, CreditCard, Plus, Menu, Zap, TrendingUp, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "@/app/auth/actions"
import { motion, AnimatePresence } from "framer-motion"
import { useSidebar } from "./SidebarContext"
import Link from "next/link"

import { getSidebarData } from "@/app/(dashboard)/sidebar-actions"

export function Header() {
    const { data: session } = useSession()
    const { setIsMobileOpen } = useSidebar()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [dynamicData, setDynamicData] = useState<any>(null)

    useEffect(() => {
        const fetchData = async () => {
            const data = await getSidebarData()
            if (data) setDynamicData(data)
        }
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const userName = session?.user?.name || "User"
    const userEmail = session?.user?.email || ""
    const userInitial = userName[0]?.toUpperCase() || userEmail[0]?.toUpperCase() || "U"

    const planMapping: Record<string, { name: string, color: string }> = {
        starter: { name: "Starter", color: "text-emerald-500" },
        growth: { name: "Growth", color: "text-indigo-400" },
        pro: { name: "Pro", color: "text-purple-400" },
        enterprise: { name: "Enterprise", color: "text-red-500" },
        free: { name: "Free", color: "text-slate-500" }
    }

    const currentPlan = dynamicData?.quotas?.plan?.toLowerCase() || session?.user?.subscriptionPlan?.toLowerCase() || "free"
    const planInfo = planMapping[currentPlan] || planMapping.free
    const notificationCount = dynamicData?.notifications?.length || 0

    const getTimeGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 18) return "Good Afternoon"
        return "Good Evening"
    }

    return (
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/[0.03] bg-slate-950/40 px-8 backdrop-blur-2xl">
            {/* Logo & Status Section */}
            <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-2 lg:hidden">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 sm:hidden">
                        <Mail className="h-5 w-5 text-white" />
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-6 text-[10px] font-mono">
                    {/* AI Engine Status */}
                    <div className="flex items-center gap-4 group/ai cursor-default">
                        <div className="flex items-center gap-3">
                            <div className="relative h-2.5 w-2.5">
                                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                                <div className="absolute -inset-1 rounded-full bg-emerald-500 animate-pulse opacity-10" />
                                <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black uppercase tracking-[0.2em] text-emerald-400 text-[9px] translate-y-0.5">Neural Hub Online</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <div className="h-[2px] w-12 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "85%" }}
                                            className="h-full bg-emerald-500/50"
                                        />
                                    </div>
                                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter">Latency: 12ms</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    {/* Architecture Status */}
                    <div className="group relative cursor-help">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all">
                            <Zap className="h-3 w-3 text-indigo-400" />
                            <span className="font-black text-white uppercase tracking-wider text-[9px]">Node <span className="text-indigo-400">8500-X</span></span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full left-0 mt-2 w-48 opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-1 group-hover:translate-y-0 z-50">
                            <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Status</p>
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                                        <span>AI Usage</span>
                                        <span className="text-indigo-400">{Math.round((dynamicData?.quotas?.ai?.remaining / dynamicData?.quotas?.ai?.limit) * 100 || 0)}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-slate-300">
                                        <span>Delivery</span>
                                        <span className="text-emerald-400">Stable</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-white/10 ml-2" />
                    <span className="text-slate-400 whitespace-nowrap">{getTimeGreeting()}, <span className="text-white font-bold">{userName}</span></span>
                </div>

                <div className={cn(
                    "relative transition-all duration-500 ease-out ml-6 group/search",
                    isSearchFocused ? "w-96" : "w-56"
                )}>
                    <Search className={cn(
                        "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300",
                        isSearchFocused ? "text-indigo-400 scale-110" : "text-slate-500"
                    )} />
                    <input
                        type="text"
                        placeholder="Scan sequences..."
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="h-10 w-full rounded-2xl border border-white/[0.05] bg-white/[0.02] pl-11 pr-12 text-[11px] text-white placeholder-slate-600 transition-all focus:bg-white/[0.05] focus:border-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/5"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40 group-focus-within/search:opacity-100 transition-opacity">
                        <kbd className="h-5 px-1.5 flex items-center justify-center rounded bg-white/5 border border-white/10 text-[8px] font-black text-slate-400">⌘</kbd>
                        <kbd className="h-5 px-1.5 flex items-center justify-center rounded bg-white/5 border border-white/10 text-[8px] font-black text-slate-400">K</kbd>
                    </div>
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-4">
                {/* Quick AI Action */}
                <button className="hidden lg:flex items-center gap-2 rounded-xl bg-indigo-600/10 px-4 py-2 text-xs font-bold text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white group">
                    <Sparkles className="h-3.5 w-3.5 group-hover:animate-pulse" />
                    <span>Generate Email</span>
                </button>

                {/* Notifications */}
                <div className="relative group/notif">
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white group">
                        <Bell className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        {notificationCount > 0 && (
                            <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 opacity-0 group-hover/notif:opacity-100 transition-all pointer-events-none group-hover/notif:pointer-events-auto translate-y-2 group-hover/notif:translate-y-0 z-50">
                        <div className="rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Feed</h4>
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">{notificationCount} NEW</span>
                            </div>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                                {dynamicData?.notifications?.length > 0 ? (
                                    dynamicData.notifications.map((notif: any) => (
                                        <div key={notif.id} className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-colors cursor-pointer group/item">
                                            <div className="flex items-start gap-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                                                    notif.type === 'error' ? "bg-rose-500/20 text-rose-400" : "bg-indigo-600/20 text-indigo-400"
                                                )}>
                                                    <Sparkles className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-bold text-white mb-0.5 group-hover/item:text-indigo-300 transition-colors capitalize">{notif.title}</p>
                                                    <p className="text-[10px] text-slate-400 leading-tight">{notif.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">No new intelligence</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Menu */}
                <div className="relative border-l border-white/5 pl-6">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-4 rounded-2xl p-1.5 pr-4 transition-all hover:bg-white/[0.03] group relative overflow-hidden"
                    >
                        <div className="h-10 w-10 rounded-xl bg-slate-800 p-[1px] relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative h-full w-full items-center justify-center rounded-xl bg-slate-950 text-[11px] font-black text-white flex">
                                {userInitial}
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col items-start text-left">
                            <span className="text-[11px] font-black text-white uppercase tracking-wider mb-0.5 max-w-[120px] truncate">{userName}</span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-indigo-500 shadow-[0_0_4px_rgba(99,102,241,0.8)]" />
                                <span className={cn(
                                    "text-[8px] font-black uppercase tracking-[0.2em]",
                                    planInfo.color
                                )}>
                                    {planInfo.name} Protocol
                                </span>
                            </div>
                        </div>
                        <ChevronDown className={cn(
                            "h-3.5 w-3.5 text-slate-500 transition-transform duration-300",
                            isProfileOpen ? "rotate-180 text-white" : "group-hover:text-slate-300"
                        )} />
                    </button>

                    <AnimatePresence>
                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-3 w-64 origin-top-right rounded-[2rem] border border-white/[0.03] bg-slate-900/90 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-20 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />

                                    <div className="px-4 py-3 border-b border-white/[0.03] mb-3 relative">
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Authenticated Entity</p>
                                        <p className="text-[11px] font-black text-white truncate outfit">{userEmail}</p>
                                    </div>

                                    <div className="space-y-1.5 relative">
                                        <Link
                                            href="/settings"
                                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/[0.03] hover:text-white group/item"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-indigo-500/20 group-hover/item:text-indigo-400 transition-colors">
                                                <Settings className="h-4 w-4" />
                                            </div>
                                            Command Settings
                                        </Link>
                                        {dynamicData?.role === "super_admin" && (
                                            <Link
                                                href="/admin"
                                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/5 border border-rose-500/10 transition-all hover:bg-rose-500/10"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <div className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                                    <Shield className="h-4 w-4" />
                                                </div>
                                                Access HQ Control
                                            </Link>
                                        )}
                                        <Link
                                            href="/billing"
                                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/[0.03] hover:text-white group/item"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-emerald-500/20 group-hover/item:text-emerald-400 transition-colors">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <span>{planInfo.name} Tier</span>
                                        </Link>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-white/[0.03] relative">
                                        <button
                                            onClick={() => signOut()}
                                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-rose-500/5 hover:text-rose-400 group/logout"
                                        >
                                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover/logout:bg-rose-500/20 transition-colors">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            Terminate Session
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    )
}
