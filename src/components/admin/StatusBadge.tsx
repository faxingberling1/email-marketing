"use client"

import { cn } from "@/lib/utils"

type StatusBadgeProps = {
    label: string
    variant: "success" | "warning" | "danger" | "info" | "neutral"
    icon?: React.ElementType
    pulse?: boolean
}

export function StatusBadge({ label, variant, icon: Icon, pulse }: StatusBadgeProps) {
    const styles = {
        success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        danger: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        info: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        neutral: "text-slate-400 bg-white/5 border-white/10",
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
            styles[variant]
        )}>
            {pulse && (
                <span className={cn(
                    "h-1.5 w-1.5 rounded-full animate-pulse",
                    variant === "danger" ? "bg-rose-500" :
                        variant === "warning" ? "bg-amber-500" : "bg-emerald-500"
                )} />
            )}
            {Icon && <Icon className="h-3 w-3" />}
            {label}
        </span>
    )
}
