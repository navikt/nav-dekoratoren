import { RequestHandler } from 'express';
import { buildDataStructure, DataKeys } from '@/utils';

export const inspectData: RequestHandler = async (req, res) => {
  `${process.env.VITE_DECORATOR_BASE_URL}/api/menu`;
  const data = await buildDataStructure(req.decoratorParams);
  const raw = await fetch(`${process.env.VITE_DECORATOR_BASE_URL}/api/menu`);
  res.json({
    data,
    raw: await raw.json(),
  });
};

export const dataHandlers: RequestHandler = async (req, res) => {
  console.log(`${process.env.VITE_DECORATOR_BASE_URL}/api/menu`);
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
