import { RequestHandler } from 'express';
import NodeCache from 'node-cache';
import { tenSeconds } from '../utils';

type RevalidateCacheFunc = (cache: NodeCache) => Promise<any>;

// Returns a RequestHandler with a cached response. The cache is periodically revalidated
// with the supplied function
export const getCachedRequestHandler = (revalidateCacheFunc: RevalidateCacheFunc, cacheKey: string): RequestHandler => {
    const cache = new NodeCache({
        stdTTL: tenSeconds,
        deleteOnExpire: false,
    });

    let isFetching = false;

    const revalidateCache = () => {
        if (isFetching) {
            return;
        }

        isFetching = true;

        revalidateCacheFunc(cache).finally(() => {
            isFetching = false;
        });
    };

    cache.on('expired', revalidateCache);

    return (req, res) => {
        const cached = cache.get(cacheKey);

        if (cached) {
            res.status(200).send(cached);
        } else {
            const sendResponseOnCacheSet = (key: string, value: any) => {
                cache.off('set', sendResponseOnCacheSet);
                console.log(`Sending cache response on set event for ${cacheKey}`);
                res.status(200).send(value);
            };

            cache.on('set', sendResponseOnCacheSet);
            revalidateCache();
        }
    };
};
