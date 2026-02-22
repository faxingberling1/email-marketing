"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, ArrowLeft, Loader2, Rocket, Info } from "lucide-react"
import { cn } from "@/lib/utils"

import { WizardStepper } from "./campaigns/WizardStepper"
import { StepIdentity } from "./campaigns/StepIdentity"
import { StepType } from "./campaigns/StepType"
import { StepContent } from "./campaigns/StepContent"
import { StepAudience } from "./campaigns/StepAudience"
import { StepOptimization } from "./campaigns/StepOptimization"
import { StepReview } from "./campaigns/StepReview"
import { StepLaunch } from "./campaigns/StepLaunch"
import { StepSequence } from "./campaigns/StepSequence"

import { getTemplates } from "@/app/(dashboard)/templates/actions"
import { createCampaign } from "@/app/(dashboard)/campaigns/actions"

interface CreateCampaignModalProps {
    isOpen: boolean
    onClose: () => void
    segments: any[]
    plan: 'free' | 'starter' | 'growth' | 'pro'
    quotas: any
}

const STEPS = ["Identity", "Type", "Content", "Audience", "Optimization", "Sequence", "Review", "Launch"]

export function CreateCampaignModal({ isOpen, onClose, segments, plan, quotas }: CreateCampaignModalProps) {
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [templates, setTemplates] = useState<any[]>([])

    // Unified State
    const [data, setData] = useState({
        identity: { name: "", description: "", senderEmail: "" },
        type: "BROADCAST",
        templateId: "",
        audienceId: "",
        optimization: { abTesting: false, sendTimeOptimization: false },
        launch: { scheduleLaunch: false, launchTime: "" },
        sequences: [] as any[]
    })

    useEffect(() => {
        if (isOpen) {
            getTemplates().then(setTemplates)
        }
    }, [isOpen])

    const handleNext = () => step < STEPS.length && setStep(step + 1)
    const handleBack = () => step > 1 && setStep(step - 1)

    const handleFinalize = async () => {
        setIsLoading(true)
        const selectedSegment = segments.find(s => s.id === data.audienceId)
        const result = await createCampaign({
            name: data.identity.name || "Untitled Campaign",
            subject: "Generative Subject (DRAFT)",
            content: "Generative Content (DRAFT)",
            segment: data.audienceId || "seg-all",
            segmentCount: selectedSegment?.count || 1000,
            status: "DRAFT",
            type: data.type as any,
            sequences: data.sequences
        })
        setIsLoading(false)
        if (result.success) onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-6xl h-[85vh] bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                            <Rocket className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Campaign Orchestrator</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Phase {step}: {STEPS[step - 1]}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {/* Steps Navigation */}
                <WizardStepper steps={STEPS} currentStep={step} />

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <div className="max-w-4xl mx-auto h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                {step === 1 && <StepIdentity data={data.identity} onChange={id => setData({ ...data, identity: id })} />}
                                {step === 2 && <StepType selectedType={data.type} onSelect={t => setData({ ...data, type: t })} plan={plan} />}
                                {step === 3 && <StepContent templates={templates} selectedId={data.templateId} onSelect={id => setData({ ...data, templateId: id })} />}
                                {step === 4 && <StepAudience segments={segments} selectedId={data.audienceId} onSelect={id => setData({ ...data, audienceId: id })} plan={plan} />}
                                {step === 5 && <StepOptimization config={data.optimization} onChange={opt => setData({ ...data, optimization: opt })} plan={plan} />}
                                {step === 6 && (
                                    <div className="h-full">
                                        {data.type === 'AUTOMATION' ? (
                                            <StepSequence
                                                steps={data.sequences}
                                                onChange={seq => setData({ ...data, sequences: seq })}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                                                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                                    <Info className="h-8 w-8 text-slate-700" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Single Broadcast Mode</h4>
                                                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-sm">
                                                        Sequences are only available for Automation campaigns. Continue to Review.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {step === 7 && <StepReview data={data} quotas={quotas} />}
                                {step === 8 && <StepLaunch config={data.launch} onChange={l => setData({ ...data, launch: l })} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-white/5 bg-slate-900/50 flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white/5 disabled:opacity-30 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            Step {step} of 8
                        </span>

                        {step === STEPS.length ? (
                            <button
                                onClick={handleFinalize}
                                disabled={isLoading}
                                className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-10 py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Execute Mission'}
                                <Rocket className="h-4 w-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-10 py-4 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10 transition-all"
                            >
                                Continue <ArrowRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
