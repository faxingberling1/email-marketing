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
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-white/5 bg-slate-950/50 px-8 backdrop-blur-xl">
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
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="relative h-2 w-2">
                                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
                                <div className="relative h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold uppercase tracking-widest text-emerald-400">System Online</span>
                                <span className="text-[8px] text-slate-500 uppercase tracking-tighter">AI: Primed for Optimization</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-4 w-[1px] bg-white/10" />

                    {/* Architecture Status */}
                    <div className="group relative cursor-help">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                            <Zap className="h-3 w-3 text-indigo-400" />
                            <span className="font-black text-white">85% <span className="text-slate-500 text-[8px] tracking-tighter ml-1">CORES ACTIVE</span></span>
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
                    "relative transition-all duration-300 ease-out ml-6",
                    isSearchFocused ? "w-80" : "w-48"
                )}>
                    <Search className={cn(
                        "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
                        isSearchFocused ? "text-indigo-400" : "text-slate-500"
                    )} />
                    <input
                        type="text"
                        placeholder="Search intel..."
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        className="h-10 w-full rounded-xl border border-white/5 bg-white/5 pl-10 pr-4 text-[11px] text-white placeholder-slate-500 transition-all focus:bg-white/10 focus:border-indigo-500/50 focus:outline-none"
                    />
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
                <div className="relative border-l border-white/10 pl-4">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 rounded-xl p-1 pr-3 transition-all hover:bg-white/5 group"
                    >
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-white group-hover:bg-transparent transition-colors">
                                {userInitial}
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col items-start text-left">
                            <span className="text-xs font-bold text-white leading-none mb-0.5 max-w-[100px] truncate">{userName}</span>
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                planInfo.color
                            )}>
                                {planInfo.name}
                            </span>
                        </div>
                        <ChevronDown className={cn(
                            "h-4 w-4 text-slate-500 transition-transform duration-200",
                            isProfileOpen ? "rotate-180" : ""
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
                                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-white/10 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-xl z-20"
                                >
                                    <div className="px-3 py-2 border-b border-white/5 mb-2">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Signed in as</p>
                                        <p className="text-xs font-semibold text-white truncate">{userEmail}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <Link
                                            href="/settings"
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Account Settings
                                        </Link>
                                        {dynamicData?.role === "super_admin" && (
                                            <Link
                                                href="/admin"
                                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 transition-all hover:bg-rose-500/20"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <Shield className="h-4 w-4" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/billing"
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <CreditCard className="h-4 w-4" />
                                            <span>{planInfo.name} Plan</span>
                                        </Link>
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-white/5">
                                        <button
                                            onClick={() => signOut()}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/10 hover:text-rose-500"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log Out
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
