import { NextFunction, Request, Response } from "express";
import { parseParams } from "./params";

export function decoratorParams (req: Request, res: Response, next: NextFunction) {
  const result = parseParams(req.query);

  if (result.success) {
    req.decorator = result.data;
  } else {
    res.status(400).send(result.error);
  }

  next();
}
