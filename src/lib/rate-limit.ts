// src/lib/rate-limit.ts
// Simple in-process token-bucket rate limiter for admin API routes.
// Keyed by user ID. 20 requests per 60 seconds.
// Not a substitute for a Redis-backed limiter in production,
// but safe and correct for a single-process deployment.

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 20

interface Bucket {
    count: number
    resetAt: number
}

const buckets = new Map<string, Bucket>()

export function checkRateLimit(userId: string): { ok: boolean; remaining: number } {
    const now = Date.now()
    const bucket = buckets.get(userId)

    if (!bucket || now >= bucket.resetAt) {
        buckets.set(userId, { count: 1, resetAt: now + WINDOW_MS })
        return { ok: true, remaining: MAX_REQUESTS - 1 }
    }

    if (bucket.count >= MAX_REQUESTS) {
        return { ok: false, remaining: 0 }
    }

    bucket.count++
    return { ok: true, remaining: MAX_REQUESTS - bucket.count }
}

// Periodically purge expired buckets to prevent memory growth
setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets) {
        if (now >= bucket.resetAt) buckets.delete(key)
    }
}, WINDOW_MS * 2)
