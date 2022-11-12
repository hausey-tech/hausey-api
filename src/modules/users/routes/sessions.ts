import { Router } from 'express';
import { celebrate } from 'celebrate';

import { CreateSessionSchema } from '../celebrate-schemas';
import { SessionsController } from '../controllers';

export const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post(
  '/',
  celebrate(CreateSessionSchema),
  sessionsController.create,
);
