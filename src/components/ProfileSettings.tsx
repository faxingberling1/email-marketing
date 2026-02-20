"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Mail,
    Shield,
    Camera,
    Check,
    Loader2,
    Zap,
    Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileSettingsProps {
    data: {
        name: string
        email: string
        role: string
        avatar: string | null
    }
}

export function ProfileSettings({ data }: ProfileSettingsProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [profile, setProfile] = useState(data)

    const handleSave = async () => {
        setIsSaving(true)
        // Simulated network delay for orbital sync
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

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
                <div className="lg:col-span-1 flex flex-col items-center">
                    <div className="relative group">
                        <div className="h-40 w-40 rounded-[2.5rem] border-2 border-dashed border-white/10 p-2 flex items-center justify-center bg-slate-900/40 hover:border-indigo-500/40 transition-all overflow-hidden">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover rounded-[2rem]" />
                            ) : (
                                <User className="h-16 w-16 text-slate-700" />
                            )}
                            <div className="absolute inset-2 bg-indigo-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-[2rem] cursor-pointer">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center border-4 border-slate-950 shadow-xl shadow-indigo-500/40">
                            <Zap className="h-4 w-4" />
                        </div>
                    </div>
                    <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center max-w-[140px]">
                        Tactical Avatar Sync: <span className="text-indigo-400 italic">Online</span>
                    </p>
                </div>

                {/* Fields Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User className="h-3 w-3" /> Full Identity
                            </label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Target className="h-3 w-3" /> Tactical Role
                            </label>
                            <input
                                type="text"
                                value={profile.role}
                                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Mail className="h-3 w-3" /> Active Frequency (Email)
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full bg-slate-900/60 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all font-mono tracking-wider"
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden",
                                saved
                                    ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                                    : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isSaving ? (
                                    <motion.div
                                        key="saving"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        SYNCING IDENTITY...
                                    </motion.div>
                                ) : saved ? (
                                    <motion.div
                                        key="saved"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check className="h-4 w-4" />
                                        COMMITTED TO CORE
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="normal"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Shield className="h-4 w-4" />
                                        COMMIT CHANGES
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
