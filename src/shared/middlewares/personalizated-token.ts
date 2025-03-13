import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export const personalizatedAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = request.headers.authorization;
  const token = process.env.BMX_TOKEN;
  console.log('authHeader', authHeader);

  if (!authHeader) {
    throw new AppError('Por favor, nos informe um token');
  }

  if (authHeader === token) {
    console.log('São iguais');
    return next();
  }
  throw new AppError('Token inválido');
};
