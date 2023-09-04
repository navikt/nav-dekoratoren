import { type Params } from '@/params';
import type { DataKeys, GetDataResponse } from '@/utils';

export function formatParams(params: Partial<Params>) {
  return new URLSearchParams(
    Object.entries(params).map(([k, v]) =>
      Array.isArray(v) ? [k, JSON.stringify(v)] : [k, v.toString()],
    ),
  );
}

export default function getContent<TKey extends DataKeys>(
  key: TKey,
  params: Partial<Params>,
): Promise<GetDataResponse[TKey]> {
  console.log('getContent', params);
  const url = new URL(
    `${import.meta.env.VITE_DECORATOR_BASE_URL}/data/${key}?${formatParams(
      params,
    )}`,
    window.location.origin,
  );

  return fetch(url).then(
    (response) => response.json() as Promise<GetDataResponse[TKey]>,
  );
}
