import { Request, Response } from 'express';

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

const driftsmeldingerServiceUrl = `${env.API_XP_SERVICES_URL}/no.nav.navno/driftsmeldinger`;

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};

export const driftsmeldingerHandler = async (req: Request, res: Response) => {
  const response = await fetch(driftsmeldingerServiceUrl);
  const driftsmeldinger = await response.json();
  res.send(driftsmeldinger);
};

export const searchHandler = async (
  req: Request<{ ord: string }>,
  res: Response,
) => {
  const results = (await (
    await fetch(`https://www.nav.no/dekoratoren/api/sok?ord=${req.query.ord}`)
  ).json()) as SearchResponse;

  res.json({
    hits: results.hits.slice(0, 5),
    total: results.total,
  });
};
