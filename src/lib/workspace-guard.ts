/**
 * src/lib/workspace-guard.ts
 *
 * Reusable workspace access guard.
 * Call this in any API route that should be blocked when
 * a workspace is suspended or soft-deleted.
 *
 * Throws typed errors that API routes can convert to HTTP responses.
 */

import { prisma } from "@/lib/db"

export class WorkspaceAccessError extends Error {
    constructor(public code: "suspended" | "deleted" | "not_found", message: string) {
        super(message)
        this.name = "WorkspaceAccessError"
    }
}

/**
 * Verify the workspace exists, is not soft-deleted, and is not suspended.
 * Uses $queryRaw to bypass stale Prisma client types.
 */
export async function requireActiveWorkspace(workspaceId: string) {
    const rows = await prisma.$queryRaw<{
        id: string
        name: string
        health_status: string
        deleted_at: Date | null
    }[]>`
        SELECT id, name, health_status, deleted_at
        FROM "Workspace"
        WHERE id = ${workspaceId}
        LIMIT 1
    `

    const ws = rows[0]

    if (!ws) {
        throw new WorkspaceAccessError("not_found", "Workspace not found")
    }

    if (ws.deleted_at !== null) {
        throw new WorkspaceAccessError("deleted", "This workspace has been deleted")
    }

    if (ws.health_status === "suspended") {
        throw new WorkspaceAccessError("suspended", "This workspace is suspended. Contact support.")
    }

    return ws
}

/**
 * Convert a WorkspaceAccessError to an HTTP response body + status.
 */
export function workspaceErrorResponse(err: WorkspaceAccessError) {
    const statusMap = { suspended: 403, deleted: 410, not_found: 404 } as const
    return {
        status: statusMap[err.code],
        body: { error: err.message, code: err.code },
    }
}
