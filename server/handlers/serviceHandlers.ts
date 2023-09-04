import { RequestHandler } from 'express';

import { env } from '@/server/env/server';

type SearchHit = {
  displayName: string;
  highlight: string;
  href: string;
};

type SearchResponse = {
  c: number;
  isMore: boolean;
  s: number;
  word: string;
  total: number;
  hits: SearchHit[];
};

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};

export const driftsmeldingerHandler: RequestHandler = async (req, res) => {
  console.log(`${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`);
  const driftsmeldingerServiceUrl = `${env.ENONICXP_SERVICES}/no.nav.navno/driftsmeldinger`;
  const response = await fetch(driftsmeldingerServiceUrl);
  const driftsmeldinger = await response.json();
  res.send(driftsmeldinger);
};

export const searchHandler: RequestHandler = async (req, res) => {
  const sokServiceUrl = `${env.ENONICXP_SERVICES}/navno.nav.no.search/search2/sok`;
  const results = (await (
    await fetch(`${sokServiceUrl}?ord=${req.query.ord}`)
  ).json()) as SearchResponse;

  res.json({
    hits: results.hits.slice(0, 5),
    total: results.total,
  });
};
