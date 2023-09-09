import { RequestHandler } from 'express';
import varslerMock from './helpers/varsler-mock.json';

import { env } from '@/server/env/server';
import { getCachedRequestHandler } from './helpers/menuHelper';

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

export const varslerHandler: RequestHandler = async (req, res) => {
  const trimmed = {
    beskjeder: varslerMock.beskjeder.slice(0, 2),
    oppgaver: varslerMock.oppgaver.slice(0, 2),
  };
  res.send(trimmed);
  // read from file
};

export const menuHandler: RequestHandler = getCachedRequestHandler();
