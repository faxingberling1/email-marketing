"use client"

import { Rocket, Clock, History, CheckCircle2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepLaunchProps {
    config: { scheduleLaunch: boolean; launchTime: string }
    onChange: (config: any) => void
}

export function StepLaunch({ config, onChange }: StepLaunchProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-32 w-32 rounded-[2.5rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 relative z-10"
                >
                    <Rocket className="h-12 w-12 text-indigo-400" />
                </motion.div>
                <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-white tracking-[0.2em] uppercase">Ready for Ignition</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Launch Sequence: Verified</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                <button
                    onClick={() => onChange({ ...config, scheduleLaunch: false })}
                    className={cn(
                        "p-6 rounded-3xl border text-left transition-all flex items-center gap-4",
                        !config.scheduleLaunch ? "bg-indigo-500/10 border-indigo-500/30 text-white" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                    )}
                >
                    <CheckCircle2 className={cn("h-6 w-6", !config.scheduleLaunch ? "text-indigo-400" : "text-slate-700")} />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest">Direct Launch</div>
                        <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest italic">Instant Transmission</div>
                    </div>
                </button>

                <button
                    onClick={() => onChange({ ...config, scheduleLaunch: true })}
                    className={cn(
                        "p-6 rounded-3xl border text-left transition-all flex items-center gap-4",
                        config.scheduleLaunch ? "bg-purple-500/10 border-purple-500/30 text-white" : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
                    )}
                >
                    <Clock className={cn("h-6 w-6", config.scheduleLaunch ? "text-purple-400" : "text-slate-700")} />
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest">Tactical Schedule</div>
                        <div className="text-[9px] font-bold opacity-50 uppercase tracking-widest italic">Delayed Execution</div>
                    </div>
                </button>
            </div>

            {config.scheduleLaunch && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl p-8 rounded-3xl border border-white/5 bg-slate-900/40 space-y-6"
                >
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <History className="h-3 w-3" /> Execution Timestamp
                        </label>
                        <input
                            type="datetime-local"
                            value={config.launchTime}
                            onChange={(e) => onChange({ ...config, launchTime: e.target.value })}
                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-5 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>
                </motion.div>
            )}
        </div>
    )
}
