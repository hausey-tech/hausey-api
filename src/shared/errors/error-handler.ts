import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm';
import { isCelebrateError } from 'celebrate';
import multer from 'multer';

import { AppError } from './app-error';

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  if (err instanceof AppError) {
    console.error('AppError: ', err.message);
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (isCelebrateError(err)) {
    const error =
      err.details.get('body') ??
      err.details.get('params') ??
      err.details.get('query');
    console.error('CelebrateError: ', error?.message);
    return response.status(400).json({
      status: 'error',
      message: error?.message,
    });
  }

  if (err instanceof multer.MulterError) {
    console.error('MulterError: ', err.code);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return response.status(400).json({
        status: 'error',
        message: `Arquivo muito grande, o tamanho máximo permitido é de ${process.env.AWS_MAX_FILE_SIZE} MB!`,
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return response.status(400).json({
        status: 'error',
        message: 'Podem ser enviados apenas 5 arquivos por vez!',
      });
    }

    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return response.status(400).json({
        status: 'error',
        message: 'Apenas imagens e PDFs são permitidos!',
      });
    }
  }

  if (err instanceof QueryFailedError) {
    const error = err.driverError?.detail ?? err.message;
    console.error('QueryError: ', error);
    return response.status(400).json({
      status: 'error',
      message: error,
    });
  }

  console.error('InternalError: ', err);
  return response.status(500).json({
    status: 'error',
    message: 'Erro interno ao servidor',
  });
}
