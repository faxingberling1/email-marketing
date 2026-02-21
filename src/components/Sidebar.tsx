"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    Mail,
    Zap,
    BarChart3,
    Settings,
    BrainCircuit,
    Library,
    HelpCircle,
    LogOut,
    ChevronLeft,
    Menu,
    X,
    Shield,
    Building2,
    Lock,
    CreditCard
} from "lucide-react"

import { cn } from "@/lib/utils"
import { signOut } from "@/app/auth/actions"
import { useSidebar } from "./SidebarContext"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/campaigns", icon: Mail },
    {
        name: "Contacts",
        href: "/contacts",
        icon: Users,
        badge: "12",
        prioritized: true,
        recommendation: "Founder segment hyper-engaged"
    },
    { name: "AI Assistant", href: "/ai-assistant", icon: BrainCircuit, badge: "New" },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Templates", href: "/templates", icon: Library },
    { name: "Automation", href: "/automation", icon: Zap },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help / Docs", href: "/help", icon: HelpCircle },
]

const adminNavigation = [
    { name: "Admin Home", href: "/admin", icon: Shield },
    { name: "Workspaces", href: "/admin/workspaces", icon: Building2 },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: BarChart3 },
    { name: "AI Usage", href: "/admin/ai-usage", icon: BrainCircuit },
]


export function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const { data: session } = useSession()

    const planMapping: Record<string, { name: string, color: string, limit: string, progress: string }> = {
        starter: { name: "Starter Plan", color: "from-emerald-500 to-teal-500", limit: "10k", progress: "15%" },
        growth: { name: "Growth Plan", color: "from-indigo-500 to-sky-500", limit: "50k", progress: "8%" },
        pro: { name: "Pro Plan", color: "from-purple-500 to-indigo-500", limit: "200k", progress: "5%" },
        enterprise: { name: "Enterprise Plan", color: "from-red-500 to-orange-500", limit: "Unlimited", progress: "2%" },
        free: { name: "Free Plan", color: "from-slate-500 to-slate-400", limit: "1k", progress: "45%" }
    }

    const currentPlan = session?.user?.subscriptionPlan?.toLowerCase() || "free"
    const planInfo = planMapping[currentPlan] || planMapping.free

    const sidebarContent = (
        <div className="flex h-full flex-col border-r border-white/5 bg-slate-950 px-3 py-6 relative">
            {/* Collapse Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-400 transition-all hover:bg-slate-800 hover:text-white z-50"
            >
                <ChevronLeft className={cn("h-3 w-3 transition-transform duration-300", isCollapsed ? "rotate-180" : "")} />
            </button>

            {/* Logo Section */}
            <div className={cn(
                "flex items-center gap-2 px-2 pb-8 transition-all duration-300",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
                    <Mail className="h-5 w-5 text-white" />
                </div>
                {!isCollapsed && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold tracking-tight text-white outfit whitespace-nowrap"
                    >
                        AEM<span className="text-indigo-500">.AI</span>
                    </motion.span>
                )}
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <div key={item.name} className="relative group">
                            <Link
                                href={item.href}
                                title={isCollapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-indigo-600/15 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.02)]",
                                    isCollapsed && "justify-center px-2",
                                    item.prioritized && !isActive && "border border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                )}
                            >
                                {/* Active/Priority Glow Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 h-1/2 w-[3px] rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <item.icon className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                                    isActive ? "text-indigo-400 scale-110" : "text-slate-500 group-hover:text-indigo-300 group-hover:scale-105",
                                    item.prioritized && "text-indigo-400 animate-pulse"
                                )} />

                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <div className="flex flex-col">
                                            <span className="truncate font-bold tracking-wide">{item.name}</span>
                                            {item.prioritized && (
                                                <span className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter -mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                                    {item.recommendation}
                                                </span>
                                            )}
                                        </div>
                                        {item.badge && (
                                            <span className={cn(
                                                "flex h-5 items-center justify-center rounded-lg px-2 text-[10px] font-black leading-none uppercase tracking-widest",
                                                item.badge === "New"
                                                    ? "bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)] animate-pulse"
                                                    : "bg-white/10 text-slate-400"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </motion.div>
                                )}

                                {/* Priority Tooltip for Collapsed State */}
                                {isCollapsed && item.prioritized && (
                                    <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)] border border-slate-950 animate-bounce" />
                                )}
                            </Link>

                            {/* Hover Neon Border Effect */}
                            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/50 transition-all duration-500" />
                        </div>
                    )
                })}

                {/* Admin Navigation */}
                {session?.user?.global_role === "super_admin" && (
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-1">
                        {!isCollapsed && (
                            <div className="px-3 mb-2">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Administrative</span>
                            </div>
                        )}
                        {adminNavigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <div key={item.name} className="relative group">
                                    <Link
                                        href={item.href}
                                        title={isCollapsed ? item.name : undefined}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                                            isActive
                                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                                : "text-slate-500 hover:bg-rose-500/5 hover:text-rose-300",
                                            isCollapsed && "justify-center px-2"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "h-5 w-5 flex-shrink-0 transition-all duration-300",
                                            isActive ? "text-rose-400" : "text-slate-600 group-hover:text-rose-400"
                                        )} />
                                        {!isCollapsed && (
                                            <span className="font-bold tracking-wide">{item.name}</span>
                                        )}
                                    </Link>
                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/0 to-transparent group-hover:via-rose-500/30 transition-all duration-500" />
                                </div>
                            )
                        })}
                    </div>
                )}
            </nav>


            {/* Footer Section (Plan & Logout) */}
            <div className="mt-auto pt-6 space-y-4">
                {!isCollapsed ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-2xl border border-white/5 bg-white/5 p-4"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Plan</p>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{planInfo.name}</span>
                            <span className="text-xs text-slate-500">Vol: {planInfo.limit}</span>
                        </div>
                        <div className="mt-3 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: planInfo.progress }}
                                className={cn("h-full bg-gradient-to-r", planInfo.color)}
                            />
                        </div>
                        <button className="mt-4 w-full rounded-xl bg-indigo-600 px-3 py-2 text-xs font-black text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/20">
                            Upgrade
                        </button>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] text-white font-black border border-white/5 bg-gradient-to-br",
                            planInfo.color
                        )}>
                            {planInfo.name[0]}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => signOut()}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-rose-500/10 hover:text-rose-500",
                        isCollapsed && "justify-center px-2"
                    )}
                >
                    <LogOut className="h-5 w-5" />
                    {!isCollapsed && <span>Log Out</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden lg:block h-full overflow-hidden flex-shrink-0"
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl"
                        >
                            {/* Close button for mobile */}
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute right-4 top-4 z-50 h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
