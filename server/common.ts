import { Request, Response } from 'express';

export const isAliveHandler = (req: Request, res: Response) => {
  res.status(200).send('OK');
};
export const isReadyHandler = (req: Request, res: Response) => {
  res.status(200).send('OK');
};
