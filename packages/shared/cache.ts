type CacheItem<Type> = {
    value: Type;
    expires: number;
};

export class ResponseCache<ValueType = string> {
    private readonly cache: Record<string, CacheItem<ValueType>> = {};
    private readonly ttl: number;

    private readonly pendingPromises = new Map<
        string,
        Promise<ValueType | null>
    >();

    constructor({ ttl }: { ttl: number }) {
        this.ttl = ttl;
    }

    async get(
        key: string,
        callback: () => Promise<ValueType>,
    ): Promise<ValueType | null> {
        const cachedItem = this.cache[key];
        const now = Date.now();

        if (cachedItem && cachedItem.expires > now) {
            return Promise.resolve(cachedItem.value);
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

                this.cache[key] = { value, expires: now + this.ttl };
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
