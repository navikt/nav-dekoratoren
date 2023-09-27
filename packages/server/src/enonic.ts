import { Node } from 'decorator-shared/types';
import { env } from './env/server';
import { SearchResult } from './types';

export const fetchMenu: () => Promise<Node[]> = () =>
  fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/menu`).then((response) =>
    response.json(),
  );

export const fetchDriftsmeldinger = () =>
  fetch(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`).then((res) =>
    res.json(),
  );
export const fetchSearch = (ord: string): Promise<SearchResult> =>
  fetch(
    `${`${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`}?ord=${ord}`,
  ).then((res) => res.json());
