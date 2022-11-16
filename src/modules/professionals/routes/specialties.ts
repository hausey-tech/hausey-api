import { Router } from 'express';

import { SpecialtiesController } from '../controllers/specialties';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const specialtiesRouter = Router();
const specialtiesController = new SpecialtiesController();

specialtiesRouter.get(
  '/specialties',
  ensureAuthentication,
  specialtiesController.index,
);
