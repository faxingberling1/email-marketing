"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Shield, Camera, Check, Loader2, Zap, Calendar, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateProfile } from "@/app/(dashboard)/settings/actions"

interface ProfileSettingsProps {
    data: {
        name: string
        email: string
        avatar: string | null
        memberSince?: string
    }
}

export function ProfileSettings({ data }: ProfileSettingsProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [profile, setProfile] = useState({ name: data.name, email: data.email })

    const handleSave = async () => {
        setIsSaving(true)
        setError(null)
        const result = await updateProfile({ name: profile.name, email: profile.email })
        setIsSaving(false)
        if (result.success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } else {
            setError(result.error || "Failed to save")
        }
    }

    const isDirty = profile.name !== data.name || profile.email !== data.email

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <User className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Identity Control</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profile Configuration Hub</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Avatar Section */}
                <div className="lg:col-span-1 flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-[2.5rem] border-2 border-dashed border-white/10 p-2 flex items-center justify-center bg-slate-900/40 hover:border-indigo-500/40 transition-all overflow-hidden">
                            {data.avatar ? (
                                <img src={data.avatar} alt="Avatar" className="h-full w-full object-cover rounded-[2rem]" />
                            ) : (
                                <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-indigo-900/60 to-slate-900 flex items-center justify-center">
                                    <span className="text-4xl font-black text-indigo-300 select-none">
                                        {(data.name || data.email || "?")[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-2 bg-indigo-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-[2rem] cursor-pointer">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center border-4 border-slate-950 shadow-xl shadow-indigo-500/40">
                            <Zap className="h-4 w-4" />
                        </div>
                    </div>

                    {/* Member since */}
                    {data.memberSince && (
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            Member since {data.memberSince}
                        </div>
                    )}
                </div>

                {/* Fields Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="h-3 w-3" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your name"
                                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="h-3 w-3" /> Account ID
                            </label>
                            <div className="w-full bg-slate-900/20 border border-white/[0.03] rounded-2xl px-5 py-4 text-xs font-bold text-slate-600 font-mono tracking-wider cursor-not-allowed truncate">
                                {data.email.split('@')[0]}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                        />
                    </div>

                    {/* Error */}
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
                                        ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/20 active:scale-95"
                                        : "bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isSaving ? (
                                    <motion.div key="saving" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                                    </motion.div>
                                ) : saved ? (
                                    <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                        <Check className="h-4 w-4" /> Saved
                                    </motion.div>
                                ) : (
                                    <motion.div key="normal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                                        <Shield className="h-4 w-4" /> Save Changes
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
