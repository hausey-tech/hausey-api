import { Request, Response, NextFunction } from 'express';

export const cors = (req: Request, res: Response, next: NextFunction) => {
  res.set('access-control-allow-origin', '*');
  res.set('access-control-allow-headers', '*');
  res.set('access-control-allow-methods', '*');

  // Preflight (OPTIONS) não envia Authorization. Responder aqui evita
  // que o ensureAuthentication rejeite com 401 e o browser bloqueie o CORS.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
};
