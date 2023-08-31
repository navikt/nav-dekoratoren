import { RequestHandler } from 'express';

export const isAliveHandler: RequestHandler = (req, res) => {
  res.status(200).send('OK');
};
export const isReadyHandler: RequestHandler = (req, res) => {
  res.status(200).send('OK');
};
