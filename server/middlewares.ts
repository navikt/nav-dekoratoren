import { NextFunction, Request, Response } from 'express';
import { Params, validateParams } from '@/params';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      decoratorParams: Params;
    }
  }
}

export function decoratorParams(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const validParams = validateParams(req.query);
  if (validParams.success) {
    req.decoratorParams = validParams.data;
  } else {
    console.error(validParams.error);
    res.status(400).send(validParams.error);
  }

  next();
}
