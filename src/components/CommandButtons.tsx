"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Send, Users, ShieldCheck, Sparkles, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Command {
    id: string
    name: string
    icon: string
    color: 'indigo' | 'purple' | 'emerald' | 'cyan'
    status: 'ready' | 'pending'
    isRecommended: boolean
    tip: string | null
}

interface CommandButtonsProps {
    commands: Command[]
}

const iconMap: Record<string, LucideIcon> = {
    'Send': Send,
    'Users': Users,
    'ShieldCheck': ShieldCheck,
    'Sparkles': Sparkles
}

// Map each command id to its destination page
const hrefMap: Record<string, string> = {
    'create': '/campaigns',
    'import': '/contacts',
    'verify': '/settings',
    'launch': '/ai-assistant'
}

// Human-readable labels (overrides the all-caps names from the server)
const labelMap: Record<string, string> = {
    'create': 'Create Campaign',
    'import': 'Import Contacts',
    'verify': 'Verify Domain',
    'launch': 'Launch AI'
}

export function CommandButtons({ commands = [] }: CommandButtonsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {commands.map((command, i) => {
                const Icon = iconMap[command.icon] || Send
                const href = hrefMap[command.id] || '/'
                const label = labelMap[command.id] || command.name

                return (
                    <Link key={command.id} href={href}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                            className={cn(
                                "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-6 transition-all backdrop-blur-sm cursor-pointer",
                                "bg-white/5 border-white/5 hover:bg-white/[0.08] active:scale-[0.98]",
                                command.isRecommended && "border-indigo-500/30 bg-indigo-500/5"
                            )}
                        >
                            {/* AI Recommendation Glow */}
                            <AnimatePresence>
                                {command.isRecommended && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute inset-0 rounded-2xl bg-indigo-500/10 blur-xl pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Status Dot */}
                            <div className="absolute top-3 right-3">
                                <div className={cn(
                                    "h-1.5 w-1.5 rounded-full shadow-[0_0_8px]",
                                    command.status === 'ready' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500 shadow-amber-500/50 animate-pulse"
                                )} />
                            </div>

                            {/* Icon */}
                            <div className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:rotate-6",
                                command.color === 'indigo' && "bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]",
                                command.color === 'purple' && "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
                                command.color === 'emerald' && "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]",
                                command.color === 'cyan' && "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]",
                            )}>
                                <Icon className="h-6 w-6" />
                            </div>

                            {/* Label */}
                            <span className="text-[11px] font-black text-slate-400 group-hover:text-white transition-colors text-center leading-tight">
                                {label}
                            </span>

                            {/* Tip tooltip */}
                            {command.tip && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileHover={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 pointer-events-none z-20 w-[140px] transition-opacity"
                                >
                                    <div className="bg-slate-900/95 border border-white/10 p-2 rounded-lg shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                                            <span className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter">Tip</span>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-300 leading-tight italic">
                                            {command.tip}
                                        </p>
                                    </div>
                                    <div className="w-2 h-2 bg-slate-900 border-l border-t border-white/10 rotate-45 absolute -top-1 left-1/2 -translate-x-1/2" />
                                </motion.div>
                            )}
                        </motion.div>
                    </Link>
                )
            })}
        </div>
    )
}
