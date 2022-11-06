import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../../config/auth';
import AppError from '../errors/AppError';

interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function ensureAuthentication(
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Falha de autenticação, nenhum token fornecido', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { id } = decoded as ITokenPayload;

    request.user = { id };

    return next();
  } catch {
    throw new AppError('Falha de autenticação, faça login novamente', 401);
  }
}
