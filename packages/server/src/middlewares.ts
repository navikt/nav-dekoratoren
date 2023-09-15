import { NextFunction, Request, Response } from 'express';
import { Params, paramsSchema } from 'decorator-shared/params';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      decoratorParams: Params;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateParams = (params: any) => {
  const parseBooleanParam = (param?: string): boolean =>
    param === 'true' ? true : false;

  return paramsSchema.safeParse({
    ...params,
    simple: parseBooleanParam(params.simple),
    feedback: parseBooleanParam(params.feedback),
    breadcrumbs: params.breadcrumbs
      ? JSON.parse(params.breadcrumbs)
      : params.breadcrumbs,
    availableLanguages: params.availableLanguages
      ? JSON.parse(params.availableLanguages)
      : params.availableLanguages,
  });
};

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
