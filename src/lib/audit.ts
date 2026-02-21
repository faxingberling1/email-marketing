import { prisma } from "@/lib/db"
import { NextRequest } from "next/server"
import { headers } from "next/headers"
import { verifyImpersonationToken } from "./impersonation"

export type AuditActionType =
    | "WORKSPACE_SUSPENDED"
    | "WORKSPACE_REACTIVATED"
    | "WORKSPACE_CREDITS_ADDED"
    | "WORKSPACE_LIMITS_RESET"
    | "WORKSPACE_HEALTH_CHANGED"
    | "WORKSPACE_PLAN_CHANGED"
    | "WORKSPACE_DELETED"
    | "USER_SUSPENDED"
    | "USER_REACTIVATED"
    | "USER_PROMOTED"
    | "USER_DEMOTED"
    | "IMPERSONATION_STARTED"
    | "IMPERSONATION_ENDED"
    | "SYSTEM_SETTING_UPDATED"
    | "MAINTENANCE_MODE_TOGGLED"
    | "SECURITY_POLICY_CHANGED"
    | "BILLING_CHECKOUT_STARTED"
    | "BILLING_PORTAL_STARTED"
    | "BILLING_ADDON_PURCHASED"

interface AuditOptions {
    actorId: string
    action: AuditActionType
    target: { type: "workspace" | "user" | "system"; id: string }
    metadata?: Record<string, any>
    req?: NextRequest
}

/**
 * Standard utility for logging administrative actions with context.
 */
export async function createAuditLog({
    actorId,
    action_type,
    target_type,
    target_id,
    metadata,
}: {
    actorId: string
    action_type: AuditActionType
    target_type: "workspace" | "user" | "system"
    target_id: string
    metadata?: Record<string, unknown>
}) {
    return (prisma as any).auditLog.create({
        data: {
            actorId,
            action_type,
            target_type,
            target_id,
            metadata: metadata ?? {},
        },
    })
}

/**
 * High-fidelity logger that captures IP, User-Agent, and Impersonation context.
 */
export async function logAdminAction({ actorId, action, target, metadata = {}, req }: AuditOptions) {
    const head = await headers();
    const ip = head.get("x-forwarded-for") || "unknown";
    const ua = head.get("user-agent") || "unknown";

    // Detect if this action is performed during impersonation
    let impersonationContext = null;
    const impToken = req?.cookies.get("impersonation_token")?.value;
    if (impToken) {
        impersonationContext = verifyImpersonationToken(impToken);
    }

    return (prisma as any).auditLog.create({
        data: {
            actorId,
            action_type: action,
            target_type: target.type,
            target_id: target.id,
            metadata: {
                ...metadata,
                _context: {
                    ip,
                    ua,
                    is_impersonating: !!impersonationContext,
                    impersonated_workspace: impersonationContext?.workspaceId
                }
            } as any,
        },
    })
}
