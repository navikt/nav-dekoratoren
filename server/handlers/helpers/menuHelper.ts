import { env } from '@/server/env/server';
import menuFallback from './menu-fallback.json';
import { RequestHandler } from 'express';
import NodeCache from 'node-cache';

const cacheKey = 'navno-menu';

// Returns a RequestHandler with a cached response. The cache is periodically revalidated
// with the supplied function
export const getCachedRequestHandler = (): RequestHandler => {
  const cache = new NodeCache({
    stdTTL: 10,
    deleteOnExpire: false,
  });

  let isFetching = false;

  const revalidateCache = () => {
    if (isFetching) {
      return;
    }

    isFetching = true;

    revalidateMenuCache(cache).finally(() => {
      isFetching = false;
    });
  };

  cache.on('expired', revalidateCache);

  return (req, res) => {
    const cached = cache.get(cacheKey);

    if (cached) {
      res.status(200).send(cached);
    } else {
      const sendResponseOnCacheSet = (key: string, value: unknown) => {
        cache.off('set', sendResponseOnCacheSet);
        console.log(`Sending cache response on set event for ${cacheKey}`);
        res.status(200).send(value);
      };

      cache.on('set', sendResponseOnCacheSet);
      revalidateCache();
    }
  };
};

export const revalidateMenuCache = async (cache: NodeCache) => {
  const menuServiceUrl = `${env.ENONICXP_SERVICES}/no.nav.navno/menu`;
  console.log(menuServiceUrl);
  return fetch(menuServiceUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
    })
    .then((json) => {
      cache.set(cacheKey, json);
      console.log('Successfully refreshed menu cache');
    })
    .catch((err) => {
      console.error(`Failed to fetch menu content - ${err}`);
      const prevCache = cache.get(cacheKey);
      if (prevCache) {
        cache.set(cacheKey, prevCache);
      } else {
        console.error(
          'No valid cache present on this instance - using static fallback',
        );
        cache.set(cacheKey, menuFallback);
      }
    });
};
