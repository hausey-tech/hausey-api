import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { SpecialtiesController } from '../controllers/specialties';

export const specialtiesRouter = Router();
const specialtiesController = new SpecialtiesController();

specialtiesRouter.get(
  '/specialties',
  ensureAuthentication,
  specialtiesController.index,
);
