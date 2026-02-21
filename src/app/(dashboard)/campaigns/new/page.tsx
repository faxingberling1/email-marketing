"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles,
    Send,
    Settings,
    Calendar,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    Zap,
    Mail,
    Type,
    Layout,
    Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createCampaign } from "../actions"
import { useRouter } from "next/navigation"

const steps = [
    { id: 1, name: "Campaign Details", icon: Type },
    { id: 2, name: "AI Content", icon: Sparkles },
    { id: 3, name: "Schedule", icon: Calendar },
    { id: 4, name: "Review", icon: Check },
]

export default function NewCampaignPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [generating, setGenerating] = useState(false)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        prompt: "",
        content: "",
        segment: "All Contacts",
        tone: "Professional",
        language: "English",
        cta: ""
    })

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleFinish = async () => {
        setSaving(true)
        const res = await createCampaign({
            name: formData.name,
            subject: formData.subject,
            segment: formData.segment,
            content: formData.content,
            status: 'completed'
        })
        if (res.success) {
            alert("Campaign saved successfully!")
            router.push("/dashboard")
        } else {
            alert("Error saving campaign.")
        }
        setSaving(false)
    }

    const generateAIContent = async () => {
        if (!formData.prompt) {
            alert("Please provide some instructions for the AI.")
            return
        }

        setGenerating(true)
        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: formData.prompt,
                    industry: "SaaS",
                    audience: formData.segment,
                    offer: "AEM.AI Platform",
                    tone: formData.tone,
                    language: formData.language,
                    cta: formData.cta
                }),
            })
            const result = await res.json()

            if (result.subjectLines && result.body) {
                setFormData(prev => ({
                    ...prev,
                    content: result.body,
                    subject: result.subjectLines[0]
                }))
            }
        } catch (error) {
            console.error('AI Generation failed:', error)
            alert("AI generation failed. Please check your API key.")
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white outfit">Create Campaign</h1>
                    <p className="text-slate-400">Design and launch your next AI-powered email campaign.</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-950 p-1 border border-slate-800">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all",
                                currentStep === step.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-50"
                            )}
                        >
                            <step.icon className="h-4 w-4" />
                            <span className="text-xs font-bold outfit">{step.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass rounded-3xl p-8 min-h-[500px] flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-1"
                    >
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white outfit">General Information</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Campaign Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Summer Launch 2026"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">Target Audience (Segment)</label>
                                        <select
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-white focus:border-indigo-500 focus:outline-none"
                                            value={formData.segment}
                                            onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                        >
                                            <option>All Contacts</option>
                                            <option>High Value Customers</option>
                                            <option>Enterprise Leads</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white outfit">AI Content Generation</h2>
                                    <button
                                        onClick={generateAIContent}
                                        disabled={generating}
                                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {generating ? "Generating..." : <><Sparkles className="h-4 w-4" /> Magic Generate</>}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">AI Prompt Instructions</label>
                                        <textarea
                                            rows={3}
                                            placeholder="Tell the AI what you want to achieve... (e.g. Professional tone, focus on our new SaaS integration)"
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-white focus:border-indigo-500 focus:outline-none"
                                            value={formData.prompt}
                                            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tone</label>
                                            <select
                                                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                value={formData.tone}
                                                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                            >
                                                <option>Professional</option>
                                                <option>Urgent</option>
                                                <option>Casual</option>
                                                <option>Friendly</option>
                                                <option>Direct</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</label>
                                            <select
                                                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                value={formData.language}
                                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            >
                                                <option>English</option>
                                                <option>Spanish</option>
                                                <option>French</option>
                                                <option>German</option>
                                                <option>Portuguese</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target CTA</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Upgrade Now"
                                                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                                value={formData.cta}
                                                onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-300">Subject Line</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-white focus:border-indigo-500 focus:outline-none"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">AI Content Output</label>
                                        <textarea
                                            rows={8}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-white outfit">Send / Schedule</h2>
                                    <p className="mt-1 text-slate-400 text-sm">Review your campaign and choose when to go live.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Line</p>
                                                <p className="mt-1 text-white font-medium">{formData.subject || "No subject set"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recipients</p>
                                                <p className="mt-1 text-white">{formData.segment}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={handleFinish}
                                                disabled={saving}
                                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                Send Now
                                            </button>
                                            <button className="w-full rounded-xl border border-slate-800 py-3 font-bold text-slate-400 hover:bg-slate-900 transition-all">
                                                Schedule for Later
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Mobile Preview</p>
                                        <div className="w-full max-w-[300px] aspect-[9/16] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 relative overflow-hidden shadow-2xl">
                                            <div className="absolute top-0 w-full h-6 bg-slate-800 flex items-center justify-center">
                                                <div className="h-1 w-12 bg-slate-700 rounded-full" />
                                            </div>
                                            <div className="p-4 mt-6 bg-white text-slate-950 h-full overflow-y-auto font-sans text-[10px]">
                                                <div className="border-b pb-2 mb-4">
                                                    <p className="font-bold">Subject: <span className="font-normal text-slate-500">{formData.subject}</span></p>
                                                </div>
                                                <div className="whitespace-pre-wrap leading-relaxed">
                                                    {formData.content || "Draft content will appear here..."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-auto pt-8 flex items-center justify-between border-t border-slate-800/50">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors disabled:opacity-0"
                    >
                        <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-indigo-50"
                    >
                        {currentStep === 4 ? "Review Finish" : "Continue"}
                        {currentStep < 4 && <ChevronRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </div>
    )
}
