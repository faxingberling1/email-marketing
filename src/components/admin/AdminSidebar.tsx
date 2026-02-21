"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, Building2, Users, BrainCircuit,
    ScrollText, Shield, CreditCard, AlertOctagon, Settings,
    BarChart3, Activity, Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
    {
        section: "PLATFORM OVERVIEW", items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/analytics", label: "Executive Metrics", icon: BarChart3 },
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
        <aside className="w-64 h-full bg-slate-950/50 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto no-scrollbar">

            <div className="p-6 space-y-8">
                {navItems.map(section => (
                    <div key={section.section} className="space-y-2">
                        <div className="px-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">
                            {section.section}
                        </div>
                        <div className="space-y-1">
                            {section.items.map(item => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group relative",
                                            isActive
                                                ? "bg-white/[0.04] text-white shadow-xl shadow-black/20"
                                                : "text-slate-500 hover:text-slate-300"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn(
                                                "h-4 w-4 transition-colors",
                                                isActive ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"
                                            )} />
                                            <span className="text-xs font-bold tracking-wide">{item.label}</span>
                                        </div>

                                        {item.alert && (
                                            <div className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse" />
                                        )}

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeAdminTab"
                                                className="absolute left-0 w-1 h-1/2 bg-indigo-500 rounded-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom context block */}
            <div className="mt-auto p-6">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-3 w-3 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Health</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>SLA Status</span>
                            <span className="text-emerald-400">99.99%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[99.99%] bg-emerald-500" />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
