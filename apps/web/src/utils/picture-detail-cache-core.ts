export interface ExpiringRequestCacheOptions {
    ttl: number
    now?: () => number
}

interface CacheEntry<T> {
    data: T
    expiresAt: number
}

export const createExpiringRequestCache = <T>(
    fetcher: (id: string) => Promise<T>,
    options: ExpiringRequestCacheOptions
) => {
    const { ttl, now = Date.now } = options
    const cache = new Map<string, CacheEntry<T>>()
    const pending = new Map<string, Promise<T>>()

    const getValidEntry = (id: string) => {
        const entry = cache.get(id)
        if (!entry) return
        if (entry.expiresAt <= now()) {
            cache.delete(id)
            return
        }
        return entry
    }

    const peek = (id: string) => getValidEntry(id)?.data

    const get = async (id: string) => {
        const cached = peek(id)
        if (cached) {
            return cached
        }

        const pendingRequest = pending.get(id)
        if (pendingRequest) {
            return pendingRequest
        }

        const request = fetcher(id)
            .then(data => {
                cache.set(id, {
                    data,
                    expiresAt: now() + ttl
                })
                return data
            })
            .finally(() => {
                pending.delete(id)
            })

        pending.set(id, request)
        return request
    }

    const invalidate = (id: string) => {
        cache.delete(id)
        pending.delete(id)
    }

    const invalidateMany = (ids: string[]) => {
        ids.forEach(id => {
            invalidate(id)
        })
    }

    const clear = () => {
        cache.clear()
        pending.clear()
    }

    return {
        get,
        peek,
        invalidate,
        invalidateMany,
        clear
    }
}
