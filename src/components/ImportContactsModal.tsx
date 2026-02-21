"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import {
    X,
    Upload,
    Download,
    CheckCircle2,
    FileText,
    AlertCircle,
    Loader2,
    Users,
    Info,
    ArrowRight,
    ChevronRight,
    Mail,
    Tag,
    User
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ImportContactsModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

const CSV_COLUMNS = [
    { icon: Mail, name: "email", required: true, description: "Contact's email address", example: "john@example.com" },
    { icon: User, name: "name", required: true, description: "Contact's full name", example: "John Smith" },
    { icon: FileText, name: "phone", required: false, description: "Phone number (optional)", example: "+1 555 000 0000" },
    { icon: FileText, name: "businessName", required: false, description: "Company or business name (optional)", example: "Acme Corp" },
    { icon: Tag, name: "tags", required: false, description: "Comma-separated tags (optional)", example: "vip,newsletter,2024" },
]

const TEMPLATE_ROWS = [
    "email,name,phone,businessName,tags",
    "john@example.com,John Smith,+1 555 000 0001,Acme Corp,\"vip,newsletter\"",
    "jane@example.com,Jane Doe,+1 555 000 0002,Beta Ltd,newsletter",
    "sam@example.com,Sam Johnson,,,new-lead",
]

function downloadTemplate() {
    const content = TEMPLATE_ROWS.join("\n")
    const blob = new Blob([content], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "contacts_import_template.csv"
    a.click()
    URL.revokeObjectURL(url)
}

export function ImportContactsModal({ isOpen, onClose, onSuccess }: ImportContactsModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [result, setResult] = useState<{ inserted?: number; skipped?: number; message?: string; error?: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { data: session } = useSession()

    const handleFile = (file: File) => {
        if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
            alert("Please upload a .csv file.")
            return
        }
        setSelectedFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleImport = async () => {
        if (!selectedFile) return
        setIsUploading(true)
        setStep(2)
        try {
            const formData = new FormData()
            formData.append('file', selectedFile)
            // userId is passed as a fallback; the API uses session auth primarily
            if (session?.user?.id) formData.append('userId', session.user.id)

            const res = await fetch('/api/contacts/import', {
                method: 'POST',
                body: formData,
            })
            const json = await res.json()

            if (!res.ok || json.error) {
                setResult({ error: json.error || json.suggestion || 'Import failed. Please check your file and try again.' })
            } else {
                setResult({ inserted: json.inserted, skipped: json.skipped, message: json.message })
            }
            setStep(3)
        } catch (err) {
            setResult({ error: 'Network error. Please try again.' })
            setStep(3)
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        const wasSuccess = result && !result.error
        setStep(1)
        setSelectedFile(null)
        setResult(null)
        setIsUploading(false)
        if (wasSuccess && onSuccess) onSuccess()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-slate-900/95 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
                {/* Header */}
                <div className="p-7 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white tracking-tight">Import Contacts</h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload a CSV file to add contacts</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-7">
                    <AnimatePresence mode="wait">
                        {/* ── STEP 1: Instructions + Upload ── */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* Instructions banner */}
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/8 border border-indigo-500/20">
                                    <Info className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-black text-white mb-1">How to import contacts</p>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Upload a <strong className="text-white">.csv</strong> file with your contacts.
                                            Download our template below to get the column order exactly right,
                                            then fill in your data and upload.
                                        </p>
                                    </div>
                                </div>

                                {/* Column guide */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Required columns</p>
                                    <div className="space-y-2">
                                        {CSV_COLUMNS.map(col => (
                                            <div key={col.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-slate-500 shrink-0">
                                                    <col.icon className="h-3.5 w-3.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-black text-white font-mono">{col.name}</span>
                                                        {col.required ? (
                                                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 uppercase tracking-wide">Required</span>
                                                        ) : (
                                                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 text-slate-500 uppercase tracking-wide">Optional</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-500">{col.description}</p>
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-600 shrink-0 hidden sm:block">{col.example}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download template button */}
                                <button
                                    onClick={downloadTemplate}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-500/8 text-indigo-400 hover:bg-indigo-500/15 hover:text-indigo-300 transition-all text-[11px] font-black uppercase tracking-widest group"
                                >
                                    <Download className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                                    Download CSV Template
                                </button>

                                {/* Drop zone */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Upload your file</p>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={handleDrop}
                                        className={cn(
                                            "relative cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all",
                                            isDragging
                                                ? "border-indigo-500/60 bg-indigo-500/10"
                                                : selectedFile
                                                    ? "border-emerald-500/40 bg-emerald-500/5"
                                                    : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv"
                                            className="hidden"
                                            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                                        />
                                        {selectedFile ? (
                                            <>
                                                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-white mb-0.5">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB · Click to change</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                    <Upload className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-white mb-0.5">Drop your CSV here</p>
                                                    <p className="text-[10px] text-slate-500">or click to browse · Max 50MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Import button */}
                                <button
                                    onClick={handleImport}
                                    disabled={!selectedFile}
                                    className="w-full flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all group"
                                >
                                    Import Contacts
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        )}

                        {/* ── STEP 2: Processing ── */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center justify-center py-16 gap-6 text-center"
                            >
                                <div className="h-16 w-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-white mb-1">Importing contacts…</p>
                                    <p className="text-[11px] text-slate-500">Reading your file and adding contacts to your list</p>
                                </div>
                                <div className="flex flex-col gap-2 w-full max-w-xs text-left">
                                    {[
                                        "Reading CSV file",
                                        "Validating email addresses",
                                        "Adding contacts to your account",
                                    ].map((line, i) => (
                                        <motion.div
                                            key={line}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.6 }}
                                            className="flex items-center gap-2 text-[11px] text-slate-400"
                                        >
                                            <ChevronRight className="h-3 w-3 text-indigo-400" />
                                            {line}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── STEP 3: Done ── */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-14 text-center gap-5"
                            >
                                {result?.error ? (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                                            <AlertCircle className="h-8 w-8 text-rose-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white mb-1">Import failed</h3>
                                            <p className="text-[11px] text-slate-400">{result.error}</p>
                                        </div>
                                        <button
                                            onClick={() => { setStep(1); setResult(null) }}
                                            className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-white hover:bg-white/10 transition-all"
                                        >
                                            Try Again
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white mb-1">Import complete!</h3>
                                            <p className="text-[11px] text-slate-400">
                                                {result?.message || `Your contacts from `}
                                                {!result?.message && <strong className="text-white">{selectedFile?.name}</strong>}
                                                {!result?.message && ` have been added successfully.`}
                                            </p>
                                            {(result?.skipped ?? 0) > 0 && (
                                                <p className="text-[10px] text-amber-400 mt-1">
                                                    {result?.skipped} duplicate{result?.skipped !== 1 ? 's' : ''} skipped
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleClose}
                                            className="px-8 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-[11px] font-black text-white transition-all shadow-lg shadow-indigo-500/20"
                                        >
                                            Done
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
