import { NextFunction, Request, Response } from 'express';
import { Params, parseParams } from './params';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      decorator: Params;
    }
  }
}

export function decoratorParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = parseParams(req.query);

  if (result.success) {
    req.decorator = result.data;
  } else {
    res.status(400).send(result.error);
  }

  next();
}
