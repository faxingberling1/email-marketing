"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Key, Loader2, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { changePassword } from "@/app/(dashboard)/settings/actions"

export function SecuritySettings() {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPass, setCurrentPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const handleSave = async () => {
        if (!currentPass || !newPass || !confirmPass) {
            setError("All fields are required")
            return
        }
        if (newPass !== confirmPass) {
            setError("New passwords do not match")
            return
        }
        if (newPass.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setIsSaving(true)
        setError(null)
        const result = await changePassword(currentPass, newPass)
        setIsSaving(false)

        if (result.success) {
            setSaved(true)
            setCurrentPass("")
            setNewPass("")
            setConfirmPass("")
            setTimeout(() => setSaved(false), 3000)
        } else {
            setError(result.error || "Failed to update security credentials.")
        }
    }

    const isDirty = currentPass.length > 0 || newPass.length > 0 || confirmPass.length > 0

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Shield className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Security Control</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authentication Hub</p>
                </div>
            </div>

            <div className="max-w-2xl space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Key className="h-3 w-3" /> Current Password
                    </label>
                    <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-all font-mono tracking-wider"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Key className="h-3 w-3 text-emerald-500" /> New Password
                    </label>
                    <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-all font-mono tracking-wider"
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Check className="h-3 w-3 text-emerald-500" /> Confirm New Password
                    </label>
                    <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500/50 transition-all font-mono tracking-wider"
                    />
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400"
                    >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                    </motion.div>
                )}

                <div className="pt-2 flex items-center justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || (!isDirty && !saved)}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                            saved
                                ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                : isDirty
                                    ? "bg-rose-500 hover:bg-rose-400 text-white shadow-xl shadow-rose-500/20 active:scale-95"
                                    : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                        )}
                    >
                        <AnimatePresence mode="wait">
                            {isSaving ? (
                                <motion.div key="saving" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                                </motion.div>
                            ) : saved ? (
                                <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                    <Check className="h-4 w-4" /> Secured
                                </motion.div>
                            ) : (
                                <motion.div key="normal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" /> Update Password
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        </div>
    )
}
