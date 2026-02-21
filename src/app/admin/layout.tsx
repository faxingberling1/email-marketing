import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { GlobalRole } from "@prisma/client"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner"

async function verifyAdminAccess() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Use raw query for absolute resilience against stale types
    const rows = await prisma.$queryRaw<any[]>`
        SELECT id, global_role, is_suspended
        FROM "User"
        WHERE id = ${session.user.id}
        LIMIT 1
    `
    const user = rows[0]

    if (!user || user.is_suspended || user.global_role !== 'super_admin') {
        redirect("/dashboard")
    }

    return user
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await verifyAdminAccess()

    return (
        <div className="h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
            {/* Impersonation Banner handled within the specialized Header or layout */}
            <ImpersonationBanner />

            <AdminHeader />

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto no-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
                    <div className="p-8 max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
