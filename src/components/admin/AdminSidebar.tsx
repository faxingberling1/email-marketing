"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, Building2, Users, BrainCircuit,
    ScrollText, Shield, CreditCard, AlertOctagon, Settings,
    BarChart3, Activity, Zap, PanelTop
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
    {
        section: "PLATFORM OVERVIEW", items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/analytics", label: "Executive Metrics", icon: BarChart3 },
            { href: "/admin/cms", label: "Landing CMS", icon: PanelTop },
        ]
    },
    {
        section: "MANAGEMENT", items: [
            { href: "/admin/workspaces", label: "Workspaces", icon: Building2 },
            { href: "/admin/enterprise", label: "Enterprise Accounts", icon: Shield },
            { href: "/admin/users", label: "User Genome", icon: Users },
            { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
        ]
    },
    {
        section: "RISK & SECURITY", items: [
            { href: "/admin/abuse", label: "Abuse Detection", icon: AlertOctagon, alert: true },
            { href: "/admin/audit-logs", label: "Platform Audit", icon: ScrollText },
        ]
    },
    {
        section: "SYSTEM STACK", items: [
            { href: "/admin/ai-usage", label: "AI Usage Monitor", icon: BrainCircuit },
            { href: "/admin/settings", label: "System Settings", icon: Settings },
        ]
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-full bg-slate-950/40 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto no-scrollbar relative z-10">
            {/* Tactical Backdrop Filter */}
            <div className="absolute inset-0 backdrop-blur-3xl -z-10" />

            <div className="p-6 space-y-8">
                {navItems.map(section => (
                    <div key={section.section} className="space-y-3">
                        <div className="px-4 flex items-center justify-between">
                            <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.25em]">
                                {section.section}
                            </div>
                            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.05] to-transparent ml-3" />
                        </div>
                        <div className="space-y-1">
                            {section.items.map(item => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                            isActive
                                                ? "bg-indigo-500/[0.05] text-white shadow-[0_0_20px_rgba(99,102,241,0.05)] border border-indigo-500/10"
                                                : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon className={cn(
                                                "h-4 w-4 transition-all duration-500",
                                                isActive ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-slate-600 group-hover:text-slate-400"
                                            )} />
                                            <span className={cn(
                                                "text-xs font-bold tracking-wide transition-colors",
                                                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                                            )}>{item.label}</span>
                                        </div>

                                        {item.alert && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse relative z-10" />
                                        )}

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeAdminTabGlow"
                                                className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-transparent to-transparent opacity-50"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.5 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom context block: Tactical Telemetry */}
            <div className="mt-auto p-6">
                <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                    {/* Atmospheric Glow */}
                    <div className="absolute -top-10 -right-10 h-20 w-20 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000" />

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">System Health</span>
                        </div>
                        <span className="text-[9px] font-black text-emerald-400 opacity-80 uppercase tracking-tighter">Live Monitor</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-500">SLA Status</span>
                            <span className="text-emerald-400 font-black outfit tracking-wider">99.99%</span>
                        </div>
                        <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden p-[1px]">
                            <div className="h-full w-[99.99%] bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" />
                        </div>
                        <div className="text-[8px] font-bold text-slate-600 text-center uppercase tracking-widest mt-1">
                            Orbital Synchronization Active
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
