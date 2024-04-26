type Callback<Type> = () => Promise<Type>;

export class ClientSideCache<ValueType = string> {
    private readonly cache: Record<string, ValueType> = {};

    async get(
        key: string,
        callback: Callback<ValueType>,
    ): Promise<ValueType | null> {
        const cachedValue = this.cache[key];
        if (cachedValue) {
            return Promise.resolve(cachedValue);
        }

        return callback()
            .then((value) => {
                if (!value) {
                    throw Error("No value returned from callback");
                }

                this.cache[key] = value;
                return value;
            })
            .catch((e) => {
                console.error(
                    `Callback error while fetching value for key ${key} - ${e}`,
                );
                return null;
            });
    }
}
