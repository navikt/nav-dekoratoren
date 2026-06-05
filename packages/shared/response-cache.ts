import { logger } from "./logger";

type CacheItem<Type> = {
    value: Type;
    expires: number;
};

// This cache returns a stale value (if it exists), while revalidating
// the requested value in the background.

// If the callback fails, retries are suppressed for `errorRetryDelay` ms to
// avoid flooding logs and downstream services (e.g. during a rolling deploy).
// Stale data is served during the backoff window.
export class ResponseCache<ValueType = unknown> {
    private readonly ttl: number;
    private readonly errorRetryDelay: number;
    private readonly cache = new Map<string, CacheItem<ValueType>>();
    private readonly pendingPromises = new Map<
        string,
        Promise<ValueType | null>
    >();
    private readonly nextRetryAfter = new Map<string, number>();

    constructor({
        ttl,
        errorRetryDelay = 0,
    }: {
        ttl: number;
        errorRetryDelay?: number;
    }) {
        this.ttl = ttl;
        this.errorRetryDelay = errorRetryDelay;
        caches.push(this);
    }

    clear() {
        this.cache.clear();
        this.pendingPromises.clear();
        this.nextRetryAfter.clear();
    }

    async get(
        key: string,
        callback: () => Promise<ValueType | null>,
    ): Promise<ValueType | null> {
        const cachedItem = this.cache.get(key);

        if (cachedItem && cachedItem.expires > Date.now()) {
            return cachedItem.value;
        }

        const retryAfter = this.nextRetryAfter.get(key);
        if (retryAfter && retryAfter > Date.now()) {
            return cachedItem?.value ?? null;
        }

        const promise = this.getPromise(key, callback);

        return cachedItem?.value || promise;
    }

    private async getPromise(
        key: string,
        callback: () => Promise<ValueType | null>,
    ) {
        const pendingPromise = this.pendingPromises.get(key);
        if (pendingPromise) {
            return pendingPromise;
        }

        const promise = callback()
            .then((value) => {
                if (!value) {
                    throw Error("No value returned from callback");
                }

                this.nextRetryAfter.delete(key);
                this.cache.set(key, { value, expires: Date.now() + this.ttl });
                return value;
            })
            .catch((e) => {
                logger.error(
                    `Callback error while fetching value for key ${key}`,
                    { error: e },
                );
                if (this.errorRetryDelay > 0) {
                    this.nextRetryAfter.set(
                        key,
                        Date.now() + this.errorRetryDelay,
                    );
                }
                return this.cache.get(key)?.value || null;
            })
            .finally(() => {
                this.pendingPromises.delete(key);
            });

        this.pendingPromises.set(key, promise);

        return promise;
    }
}

const caches: ResponseCache[] = [];

export const clearCache = () => caches.forEach((cache) => cache.clear());
