"use client"

import { Clock, MousePointer2, Shuffle, Sparkles, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepOptimizationProps {
    config: { abTesting: boolean; sendTimeOptimization: boolean }
    onChange: (config: any) => void
    plan: string
}

export function StepOptimization({ config, onChange, plan }: StepOptimizationProps) {
    const isFree = plan === 'free'

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* A/B Testing Toggle */}
                <div
                    onClick={() => !isFree && onChange({ ...config, abTesting: !config.abTesting })}
                    className={cn(
                        "p-8 rounded-[2.5rem] border transition-all cursor-pointer group",
                        config.abTesting ? "bg-indigo-500/10 border-indigo-500/30" : "bg-white/5 border-white/5 hover:border-white/10",
                        isFree && "opacity-50 grayscale"
                    )}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                            config.abTesting ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-500"
                        )}>
                            <Shuffle className="h-6 w-6" />
                        </div>
                        {isFree && <span className="text-[8px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-widest">PRO</span>}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Subject A/B Testing</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Synthesize two subject variants and let AI detect the winning pattern in the first 1,000 sends.
                    </p>
                </div>

                {/* Send-Time Optimization */}
                <div
                    onClick={() => plan !== 'free' && plan !== 'starter' && onChange({ ...config, sendTimeOptimization: !config.sendTimeOptimization })}
                    className={cn(
                        "p-8 rounded-[2.5rem] border transition-all cursor-pointer group",
                        config.sendTimeOptimization ? "bg-purple-500/10 border-purple-500/30" : "bg-white/5 border-white/5 hover:border-white/10",
                        (plan === 'free' || plan === 'starter') && "opacity-50 grayscale"
                    )}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                            config.sendTimeOptimization ? "bg-purple-500 text-white" : "bg-white/10 text-slate-500"
                        )}>
                            <Clock className="h-6 w-6" />
                        </div>
                        {(plan === 'free' || plan === 'starter') && <span className="text-[8px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded-lg uppercase tracking-widest">GROWTH+</span>}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">Neural Send-Time</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Orchestrate individual delivery based on recipient's historical peak engagement window.
                    </p>
                </div>
            </div>

            {config.abTesting && (
                <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-400" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Predicted Performance Boost</h4>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest text-center">
                        Synthesized Gain: +4.2% Click-Through Potential
                    </p>
                </div>
            )}
        </div>
    )
}
