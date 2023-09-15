import { formatParams, type Params } from 'decorator-shared/params';

export default function getContent(key: string, params: Partial<Params>) {
  const url = new URL(
    `/data/${key}?${formatParams(params)}`,
    window.location.origin,
  );

  return fetch(url).then((response) => response.json());
}
