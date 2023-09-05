import { RequestHandler } from 'express';
import { buildDataStructure, DataKeys } from '@/utils';

export const inspectData: RequestHandler = async (req, res) => {
  const data = await buildDataStructure(req.decoratorParams);
  try {
    const raw = await fetch(`https://www.nav.no/dekoratoren/api/meny`);
    res.json({
      data,
      raw: await raw.json(),
    });
  } catch (e) {
    console.error(`Failed to fetch menu: ${e}`);
  }
};

export const dataHandlers: RequestHandler = async (req, res) => {
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
