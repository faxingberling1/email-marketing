"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, UserPlus, Search, BrainCircuit, Zap, Activity, Radar, AlertCircle, Download, CheckCircle2, Mail, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactTable } from "@/components/ContactTable"
import { SegmentClusters } from "@/components/SegmentClusters"
import { ImportContactsModal } from "@/components/ImportContactsModal"
import { AddContactModal } from "@/components/AddContactModal"
import { getContactsData, deleteContact } from "./actions"

export default function ContactsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isImportOpen, setIsImportOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null) // holds contact id to delete

    const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }

    const loadData = async () => {
        setLoading(true)
        const result = await getContactsData()
        setData(result)
        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        setConfirmDelete(id)
    }

    const confirmDeletion = async () => {
        if (!confirmDelete) return
        try {
            await deleteContact(confirmDelete)
            setConfirmDelete(null)
            showToast('Entity decommissioned successfully.', 'success')
            loadData()
        } catch (err) {
            console.error(err)
            showToast('Failed to decommission entity.', 'error')
            setConfirmDelete(null)
        }
    }

    const handleMail = (email: string) => {
        showToast(`📡 Signal queued for ${email}`, 'info')
    }

    useEffect(() => {
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Zap className="h-8 w-8 text-indigo-500" />
                </motion.div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Loading contacts...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Status Bar (Sub-header) */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between rounded-3xl border border-indigo-500/20 bg-indigo-500/5 px-8 py-6 backdrop-blur-md"
            >
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400/60">Contacts</p>
                        <h1 className="text-xl font-black text-white tracking-tight">Manage Contacts</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsImportOpen(true)}
                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5 transition-all group"
                    >
                        <Download className="h-4 w-4" />
                        Import Contacts
                    </button>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all group"
                    >
                        <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Add Contact
                    </button>
                </div>
            </motion.div>

            {/* Tactical Intelligence HUDs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SegmentClusters clusters={data?.clusters || []} />
                </div>

                {/* Relationship Radar Panel */}
                <div className="p-6 rounded-[2.5rem] border border-indigo-500/10 bg-indigo-500/5 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Radar className="h-32 w-32 text-indigo-400 animate-pulse" />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <Radar className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Contact Insights</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg. Conversion Rate</span>
                                <span className="text-xl font-black text-emerald-400 tracking-tighter">{data?.predictions?.avgLikelihoodToConvert}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Predicted Churn Rate</span>
                                <span className="text-xl font-black text-rose-400 tracking-tighter">{data?.predictions?.predictedChurnRate}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-3.5 w-3.5 text-indigo-400" />
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">At-Risk Contacts</span>
                                </div>
                                <span className="text-xl font-black text-white tracking-tighter">{data?.predictions?.atRiskCount}</span>
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl text-[8px] font-black text-white uppercase tracking-[0.3em] transition-all relative z-10 border border-white/5">
                        Launch Retention Campaign
                    </button>
                </div>
            </div>

            {/* Tactical Contacts Table */}
            <div className="space-y-4">
                <ContactTable
                    contacts={data?.contacts || []}
                    onDelete={handleDelete}
                    onMail={handleMail}
                />
            </div>

            {/* Tactical Ingress Modals */}
            <ImportContactsModal
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                onSuccess={loadData}
            />
            <AddContactModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onSuccess={loadData}
            />

            {/* Confirm Delete Modal */}
            <AnimatePresence>
                {confirmDelete && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmDelete(null)}
                            className="fixed inset-0 z-[200] bg-slate-950/70 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl p-8 text-center"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-5">
                                <Trash2 className="h-6 w-6 text-rose-400" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.15em] mb-2">Decommission Entity</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">
                                This action is irreversible. The entity will be permanently purged from the tactical database.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all border border-white/5"
                                >
                                    Abort
                                </button>
                                <button
                                    onClick={confirmDeletion}
                                    className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-[10px] font-black text-white uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Decommission
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* In-App Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={cn(
                            "fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-[11px] font-bold uppercase tracking-widest max-w-xs",
                            toast.type === 'success' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
                            toast.type === 'error' && "bg-rose-500/10 border-rose-500/20 text-rose-300",
                            toast.type === 'info' && "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="h-4 w-4 shrink-0" />}
                        {toast.type === 'info' && <Mail className="h-4 w-4 shrink-0" />}
                        <span>{toast.message}</span>
                        <button onClick={() => setToast(null)} className="ml-auto text-current/50 hover:text-current transition-colors">
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
