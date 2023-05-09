import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateSessionSchema } from '../celebrate-schemas/session';
import { SessionsController } from '../controllers/sessions';

export const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate(CreateSessionSchema),
  sessionsController.create,
);
