import crypto from 'crypto';

// Use NEXTAUTH_SECRET as the signing key for consistency
const SECRET = process.env.NEXTAUTH_SECRET || 'enterprise-impersonation-fallback-secret-2024';

export interface ImpersonationPayload {
    adminId: string;
    adminEmail: string;
    workspaceId: string;
    workspaceName: string;
    expiresAt: number;
}

/**
 * Signs an impersonation payload into a tamper-proof token string.
 */
export function signImpersonationToken(payload: ImpersonationPayload): string {
    const payloadStr = JSON.stringify(payload);
    const signature = crypto
        .createHmac('sha256', SECRET)
        .update(payloadStr)
        .digest('hex');

    return `${Buffer.from(payloadStr).toString('base64')}.${signature}`;
}

/**
 * Verifies a token and returns the payload if valid, or null if tampered/expired.
 */
export function verifyImpersonationToken(token: string): ImpersonationPayload | null {
    try {
        const [payloadBase64, signature] = token.split('.');
        if (!payloadBase64 || !signature) return null;

        const payloadStr = Buffer.from(payloadBase64, 'base64').toString();
        const expectedSignature = crypto
            .createHmac('sha256', SECRET)
            .update(payloadStr)
            .digest('hex');

        if (signature !== expectedSignature) {
            console.error('[IMPERSONATION] Invalid signature detected');
            return null;
        }

        const payload = JSON.parse(payloadStr) as ImpersonationPayload;

        // Expiration check
        if (Date.now() > payload.expiresAt) {
            console.warn('[IMPERSONATION] Token expired');
            return null;
        }

        return payload;
    } catch (error) {
        console.error('[IMPERSONATION] Verification failed:', error);
        return null;
    }
}
