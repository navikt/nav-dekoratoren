import { Node } from 'decorator-shared/types';
import { env } from './env/server';
import { SearchResult } from 'decorator-shared/types';

let cachedAt = 0;
let menuCache: Node[];

export const fetchMenu: () => Promise<Node[]> = async () => {
  if (cachedAt + 1000 * 60 * 5 < Date.now()) {
    cachedAt = Date.now();
    menuCache = await fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then(
      (response) => response.json(),
    );
  }
  return menuCache;
};

export const fetchDriftsmeldinger = () =>
  fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then((res) =>
    res.json(),
  );
export const fetchSearch = (ord: string): Promise<SearchResult> =>
  fetch(
    `${`${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`}?ord=${ord}`,
  ).then((res) => res.json());
