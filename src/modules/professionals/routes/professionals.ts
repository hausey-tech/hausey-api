import { Router } from 'express';

import { ProfessionalsController } from '../controllers/professionals';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.post(
  '/',
  ensureAuthentication,
  professionalsController.create,
);
