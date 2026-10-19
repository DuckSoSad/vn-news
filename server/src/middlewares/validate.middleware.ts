import type { NextFunction, Request, Response } from 'express';
import type { z } from 'zod';

export const validate = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as Record<string, Record<string, unknown>>;

      req.body = result.body;
      req.params = result.params as Record<string, string>;

      for (const key of Object.keys(req.query)) delete req.query[key];
      Object.assign(req.query, result.query);

      next();
    } catch (error) {
      next(error);
    }
  };
};
