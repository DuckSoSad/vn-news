import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HandleError } from '../errors/handle-error.js';

export const ErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.log('❌ BACK-END CRASHED HERE:', err);

  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join('.').replace(/^(body|params|query)\./, ''),
      message: issue.message,
    }));

    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
    return;
  }

  if (err instanceof HandleError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  console.error('System Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
