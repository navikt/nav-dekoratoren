import { Params, formatParams } from "@/params";
import type { DataKeys, GetDataResponse } from "@/utils";

const cache: Record<string, GetDataResponse[DataKeys]> = {};

// Typesafe fetch
export async function getContentData<TKey extends DataKeys>(key: TKey, params: Partial<Params>): Promise<GetDataResponse[TKey]> {
    const url = new URL(`/data/${key}`, window.location.origin);
    url.search = formatParams(params).toString();
    const cacheKey = `${key}-${JSON.stringify(params)}`;

    if (cacheKey in cache) {
        return cache[cacheKey] as GetDataResponse[TKey];
    }
    const response = await fetch(url).then((response) => response.json() as Promise<GetDataResponse[TKey]>);
    cache[cacheKey] = response;
    return response;
}

