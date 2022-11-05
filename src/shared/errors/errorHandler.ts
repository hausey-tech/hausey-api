import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import AppError from './AppError';

export default function errorHandler(
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
    const errorBody = err.details.get('body');
    return response.status(400).json({
      status: 'error',
      message: errorBody?.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno ao servidor',
  });
}
