"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldAlert, CheckCircle2, Loader2, MailQuestion } from "lucide-react"
import { unsubscribeContact } from "./actions"

function UnsubscribeContent() {
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    const [status, setStatus] = useState<"loading" | "ready" | "success" | "error">("loading")
    const [email, setEmail] = useState("")

    useEffect(() => {
        // In a real app, we'd fetch the contact email to confirm
        if (id) {
            setStatus("ready")
        } else {
            setStatus("error")
        }
    }, [id])

    const handleUnsubscribe = async () => {
        if (!id) return
        setStatus("loading")
        try {
            await unsubscribeContact(id)
            setStatus("success")
        } catch (err) {
            setStatus("error")
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Background Atmosphere */}
            <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass p-10 rounded-[40px] border border-white/10 text-center space-y-8 relative z-10"
            >
                {status === "success" ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-6">
                        <div className="h-20 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto text-emerald-400">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black outfit">Signal Terminated</h1>
                            <p className="text-slate-400 font-medium">You have been successfully removed from our orbital network. We're sorry to see you go.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = "/"}
                            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Return to Base
                        </button>
                    </motion.div>
                ) : status === "error" ? (
                    <div className="space-y-6">
                        <div className="h-20 w-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto text-rose-400">
                            <ShieldAlert className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black outfit">Encryption Fault</h1>
                            <p className="text-slate-400 font-medium">We couldn't verify your signal. This link may have expired or is malformed.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="h-20 w-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto text-indigo-400">
                            <MailQuestion className="h-10 w-10" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black outfit">Confirm Detachment</h1>
                            <p className="text-slate-400 font-medium text-sm">Are you sure you want to stop receiving intelligent insights and tactical updates from MailMind?</p>
                        </div>

                        <button
                            onClick={handleUnsubscribe}
                            disabled={status === "loading"}
                            className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Syncing Status...</span>
                                </>
                            ) : (
                                "UNSUBSCRIBE"
                            )}
                        </button>

                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Identity: {id?.substring(0, 8)}...
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default function UnsubscribePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black outfit text-white uppercase tracking-widest">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mr-4" />
                Establishing Uplink...
            </div>
        }>
            <UnsubscribeContent />
        </Suspense>
    )
}
