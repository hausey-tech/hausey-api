import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '../../config/auth';
import { AppError } from '../errors/app-error';

interface ITokenPayload {
  id: string;
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
  const apiKey = request.headers['api-key'];

  // if (!authHeader) {
  //   throw new AppError('Falha de autenticação, nenhum token fornecido', 401);
  // }
  if (authHeader && apiKey) {
    throw new AppError(
      'Both JWT token and API key provided. Please use only one type of authentication.',
      400,
    );
  }

  if (authHeader) {
    const [, token] = authHeader.split(' ');

    const { secret } = authConfig.jwt;

    try {
      const decoded = verify(token, secret);

      const { id, role } = decoded as ITokenPayload;

      request.user = { id, role };

      return next();
    } catch {
      console.log(
        'Erro ao autenticar, erro 401. O Autentication token tá inválido.',
      );
      throw new AppError(
        'Failed to authenticate token. Please login again.',
        401,
      );
    }
  }

  if (apiKey) {
    const { apiKey: expectedApiKey } = authConfig;

    if (apiKey !== expectedApiKey) {
      console.log('API KEY INVÁLIDO, 401');
      throw new AppError('Invalid API key.', 401);
    }

    // You may optionally set a user object in request for API key authentication
    request.user = { id: null, role: 'manager' }; // Or any other value to represent an unauthenticated user

    return next();
  }

  throw new AppError('Falha de autenticação, nenhum token fornecido', 401);
};
