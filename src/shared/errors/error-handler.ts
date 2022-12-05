import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import { isCelebrateError } from 'celebrate';

import { AppError } from './app-error';

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (isCelebrateError(err)) {
    const error =
      err.details.get('body') ||
      err.details.get('params') ||
      err.details.get('query');
    return response.status(400).json({
      status: 'error',
      message: error?.message,
    });
  }

  if (err instanceof QueryFailedError) {
    const error = err.driverError?.detail || err.message;
    return response.status(400).json({
      status: 'error',
      message: error,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno ao servidor',
  });
}
