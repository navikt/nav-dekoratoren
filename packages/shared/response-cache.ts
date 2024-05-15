type CacheItem<Type> = {
    value: Type;
    expires: number;
};

// This cache always returns a stale value (if it exists), while revalidating
// the requested value in the background
export class StaleWhileRevalidateResponseCache<ValueType = unknown> {
    private readonly ttl: number;
    private readonly cache = new Map<string, CacheItem<ValueType>>();
    private readonly pendingPromises = new Map<
        string,
        Promise<ValueType | null>
    >();

    constructor({ ttl }: { ttl: number }) {
        this.ttl = ttl;
        caches.push(this);
    }

    clear() {
        this.cache.clear();
        this.pendingPromises.clear();
    }

    async get(
        key: string,
        callback: () => Promise<ValueType | null>,
    ): Promise<ValueType | null> {
        const cachedItem = this.cache.get(key);

        if (cachedItem && cachedItem.expires > Date.now()) {
            return cachedItem.value;
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

                this.cache.set(key, { value, expires: Date.now() + this.ttl });
                return value;
            })
            .catch((e) => {
                console.error(
                    `Callback error while fetching value for key ${key} - ${e}`,
                );
                return this.cache.get(key)?.value || null;
            })
            .finally(() => {
                this.pendingPromises.delete(key);
            });

        this.pendingPromises.set(key, promise);

        return promise;
    }
}

const caches: StaleWhileRevalidateResponseCache[] = [];

export const clearCache = () => caches.forEach((cache) => cache.clear());
