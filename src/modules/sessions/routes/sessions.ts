import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateSessionSchema } from '../celebrate-schemas/session';
import { SessionsController } from '../controllers/sessions';
import { cors } from '../../../shared/middlewares/cors';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

export const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  cors,
  celebrate(CreateSessionSchema),
  sessionsController.create,
);

sessionsRouter.get('/', cors, ensureAuthentication, sessionsController.refresh);
