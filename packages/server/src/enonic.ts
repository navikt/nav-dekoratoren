import { OpsMessage, Node } from 'decorator-shared/types';
import { env } from './env/server';
import { SearchResult } from 'decorator-shared/types';

let cachedAt = 0;
let menuCache: Node[];

export const fetchMenu: () => Promise<Node[]> = async () => {
  console.log('feting menu from enonic');
  if (cachedAt + 1000 * 60 * 5 < Date.now()) {
    cachedAt = Date.now();
    menuCache = (await fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then(
      (response) => response.json(),
    )) as Node[];
  }
  console.log('returning menu from enonic', menuCache);
  return menuCache;
};

export const fetchOpsMessages = (): Promise<OpsMessage[]> => {
  console.log('feting driftsmeldinger from enonic');
  const driftsmeldinger = fetch(
    `${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`,
  ).then((res) => res.json()) as Promise<OpsMessage[]>;

  console.log('returning driftsmeldinger from enonic', driftsmeldinger);

  return driftsmeldinger;
};

export const fetchSearch = (query: string): Promise<SearchResult> =>
  fetch(
    `${`${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`}?ord=${query}`,
  )
    .then((res) => res.json() as Promise<SearchResult>)
    .then((res) => ({
      ...res,
      hits: res.hits.map((hit) => ({
        ...hit,
        highlight: hit.highlight
          ?.replace(/<\/?[^>]+(>|$)/g, '') // Remove html
          .replace(/\[.*?(\])/g, '') // Remove shortcodes
          .replace(/(\[|<).*?(\(...\))/g, ''), // Remove incomplete html/shortcodes;
      })),
    }));
