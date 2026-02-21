// Simple Neural Cache - In-memory TTL Cache
type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function getCachedData<T>(key: string, ttlMs: number): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > ttlMs;
    if (isExpired) {
        cache.delete(key);
        return null;
    }

    return entry.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}
