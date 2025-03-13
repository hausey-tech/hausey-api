import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const personalizatedAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = request.headers.authorization;
  const token = process.env.BMX_TOKEN;

  if (authHeader === token) {
    return next();
  }
  throw new AppError('Token inválido');
};
