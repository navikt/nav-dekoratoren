type CacheItem<Type> = {
    value: Type;
    expires: number;
};

export class ResponseCache<ValueType = unknown> {
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
        callback: () => Promise<ValueType>,
    ): Promise<ValueType | null> {
        const cachedItem = this.cache.get(key);
        const now = Date.now();

        if (cachedItem) {
            if (cachedItem.expires > now) {
                return Promise.resolve(cachedItem.value);
            } else {
                this.cache.delete(key);
            }
        }

        const pendingPromise = this.pendingPromises.get(key);
        if (pendingPromise) {
            return pendingPromise;
        }

        const promise = callback()
            .then((value) => {
                if (!value) {
                    throw Error("No value returned from callback");
                }

                this.cache.set(key, { value, expires: now + this.ttl });
                return value;
            })
            .catch((e) => {
                console.error(
                    `Callback error while fetching value for key ${key} - ${e}`,
                );
                return null;
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
