import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { MemedController } from '../controllers/memed';

export const memedRouter = Router();
const memedController = new MemedController();

memedRouter.get(
  '/memed/prescriptions/users/:token',
  ensureAuthentication,
  memedController.search,
);

memedRouter.post(
  '/memed/prescriptions/users',
  ensureAuthentication,
  memedController.create,
);

memedRouter.get(
  '/memed/users/:token',
  ensureAuthentication,
  memedController.getUserByToken,
);

memedRouter.get(
  '/memed/import-specialties',
  ensureAuthentication,
  memedController.importSpecialties,
);

memedRouter.delete(
  '/memed/prescriptions/users/:id',
  ensureAuthentication,
  memedController.delete,
);
