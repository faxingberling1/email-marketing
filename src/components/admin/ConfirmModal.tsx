"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Loader2, X } from "lucide-react"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    variant?: "danger" | "warning" | "info"
    loading?: boolean
}

export function ConfirmModal({
    isOpen, onClose, onConfirm, title, description,
    confirmText = "Confirm Change", variant = "danger", loading
}: ConfirmModalProps) {
    if (!isOpen) return null

    const colors = {
        danger: "bg-rose-500 hover:bg-rose-600",
        warning: "bg-amber-500 hover:bg-amber-600 text-black",
        info: "bg-indigo-500 hover:bg-indigo-600",
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center border",
                            variant === "danger" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                variant === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                                    "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                        )}>
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-2 mb-8">
                        <h3 className="text-xl font-black text-white outfit">{title}</h3>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">{description}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={cn(
                                "w-full py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                                colors[variant]
                            )}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 text-slate-400 hover:text-white transition-all text-sm font-black uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ")
}
