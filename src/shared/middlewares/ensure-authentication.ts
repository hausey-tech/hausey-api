import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '../../config/auth';
import { AppError } from '../errors/app-error';

interface ITokenPayload {
  id: string;
  roleId: string;
  role: 'patient' | 'professional' | 'manager';
  iat: number;
  exp: number;
}

export const ensureAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction,
): Response | void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Falha de autenticação, nenhum token fornecido', 401);
  }

  const [, token] = authHeader.split(' ');

  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);

    const { id, roleId, role } = decoded as ITokenPayload;

    request.user = { id, roleId, role };

    return next();
  } catch {
    throw new AppError('Falha de autenticação, faça login novamente', 401);
  }
};
