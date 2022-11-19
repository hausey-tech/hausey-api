import { Router } from 'express';

import { ProfessionalSpecialtiesController } from '../controllers/professional-specialties';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const professionalSpecialtiesRouter = Router();
const professionalSpecialtiesController =
  new ProfessionalSpecialtiesController();

professionalSpecialtiesRouter.get(
  '/specialties',
  ensureAuthentication,
  professionalSpecialtiesController.index,
);
