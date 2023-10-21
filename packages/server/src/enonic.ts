import { Driftsmelding, Node } from 'decorator-shared/types';
import { env } from './env/server';
import { SearchResult } from 'decorator-shared/types';

let cachedAt = 0;
let menuCache: Node[];

export const fetchMenu: () => Promise<Node[]> = async () => {
  if (cachedAt + 1000 * 60 * 5 < Date.now()) {
    cachedAt = Date.now();
    menuCache = (await fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then(
      (response) => response.json(),
    )) as Node[];
  }
  return menuCache;
};

export const fetchDriftsmeldinger = (): Promise<Driftsmelding[]> =>
  fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then((res) =>
    res.json(),
  ) as Promise<Driftsmelding[]>;

export const fetchSearch = (ord: string): Promise<SearchResult> =>
  fetch(
    `${`${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`}?ord=${ord}`,
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
