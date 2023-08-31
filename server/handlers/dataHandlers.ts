import { Request, Response } from 'express';
import { buildDataStructure, DataKeys } from '@/utils';

export const inspectData = async (req: Request, res: Response) => {
  const data = await buildDataStructure(req.decoratorParams);
  const raw = await fetch('https://www.nav.no/dekoratoren/api/meny');
  res.json({
    data,
    raw: await raw.json(),
  });
};

export const dataHandlers = async (req: Request, res: Response) => {
  const { params } = req;
  const dataKey = params.key as DataKeys;

  if (!dataKey) {
    return res.status(400).send('Missing key');
  }

  const data = await buildDataStructure(req.decoratorParams);
  const subset = data[dataKey];

  if (!subset) {
    res.status(404).send('Data not found with key:' + dataKey);
  }

  res.send(subset);
};
