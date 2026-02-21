"use client"

import {
    Search, Bell, Sparkles, ChevronDown, LogOut, Settings,
    Shield, Command, Zap, AlertTriangle, Building2, Plus,
    Globe, Terminal, Cpu
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "@/app/auth/actions"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function AdminHeader() {
    const { data: session } = useSession()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isActionOpen, setIsActionOpen] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Shield className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white outfit tracking-tight">CONTROL CENTER</span>
                                <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded text-white", envColor)}>
                                    {env}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: Global Search */}
                <div className="flex-1 max-w-2xl hidden lg:block">
                    <div className={cn(
                        "relative group transition-all duration-300",
                        isSearchFocused ? "scale-[1.02]" : "scale-100"
                    )}>
                        <Search className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                            isSearchFocused ? "text-indigo-400" : "text-slate-500"
                        )} />
                        <input
                            type="text"
                            placeholder="Search users, workspaces, or transaction IDs..."
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="w-full h-10 bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-16 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-black text-slate-500">⌘</kbd>
                            <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-black text-slate-500">K</kbd>
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
                            className="h-10 px-4 bg-white text-black text-xs font-black rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Actions</span>
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
                    <button className="h-10 w-10 flex items-center justify-center bg-white/[0.03] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.05] transition-all relative group">
                        <Bell className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
                        <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-slate-950" />
                    </button>

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
        </header>
    )
}
