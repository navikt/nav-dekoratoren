import { type Params } from "@/params";
import type { DataKeys, GetDataResponse } from "@/utils";

export function formatParams(params: Partial<Params>) {
  const result = new URLSearchParams();

  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      // it's an array, so we need to stringify it
      result.append(k, JSON.stringify(v));
    } else {
      result.append(k, v.toString());
    }
  }

  return result;
}


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

