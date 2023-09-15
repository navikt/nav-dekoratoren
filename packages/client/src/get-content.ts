import { formatParams, type Params } from 'decorator-shared/params';
import type { DataKeys, GetDataResponse } from 'decorator-shared/utils';

export default function getContent<TKey extends DataKeys>(
  key: TKey,
  params: Partial<Params>,
) {
  const url = new URL(
    `/data/${key}?${formatParams(params)}`,
    window.location.origin,
  );

  return fetch(url).then(
    (response) => response.json() as Promise<GetDataResponse[TKey]>,
  );
}
