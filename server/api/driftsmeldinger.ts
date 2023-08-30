import { RequestHandler } from 'express';

import { env } from '@/server/env/server';

const driftsmeldingerServiceUrl = `${env.API_XP_SERVICES_URL}/no.nav.navno/driftsmeldinger`;

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};

export const driftsmeldingerHandler: RequestHandler = async (req, res) => {
  const response = await fetch(driftsmeldingerServiceUrl);
  const driftsmeldinger = await response.json();
  res.send(driftsmeldinger);
};
