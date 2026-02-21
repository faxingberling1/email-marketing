"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, Loader2, CheckCircle2, User, Mail, Building2, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { createContact } from "@/app/(dashboard)/contacts/actions"

interface AddContactModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

export function AddContactModal({ isOpen, onClose, onSuccess }: AddContactModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", businessName: "", tags: "" })
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        try {
            const tagsArray = formData.tags
                ? formData.tags.split(",").map(t => t.trim()).filter(t => t !== "")
                : []

            await createContact({
                ...formData,
                tags: tagsArray
            })
            setIsSuccess(true)
            setTimeout(() => {
                onClose()
                if (onSuccess) onSuccess()
                // Reset states
                setIsSuccess(false)
                setFormData({ name: "", email: "", phone: "", businessName: "", tags: "" })
            }, 2000)
        } catch (err: any) {
            setError(err.message || "Failed to create contact")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-xl bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
                {/* Modal Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase">Add Contact</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Capture Professional Intelligence</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center"
                            >
                                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Contact Synced</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {formData.email} has been added to the tactical database.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Identity Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Signal Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="contact@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Business Name */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Business Entity</label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Company Name"
                                                value={formData.businessName}
                                                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Contact Signal</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <input
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="col-span-full space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Tactical Tags (Comma Separated)</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500 group-focus-within:text-indigo-400">
                                                <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">#</div>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="VIP, Founder, Early Adopter..."
                                                value={formData.tags}
                                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest text-center">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-500 hover:bg-indigo-400 py-5 rounded-[1.5rem] text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            SYNCHRONIZING...
                                        </>
                                    ) : (
                                        <>
                                            ADD CONTACT
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
