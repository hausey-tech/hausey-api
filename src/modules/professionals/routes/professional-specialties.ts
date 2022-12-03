import { Router } from 'express';
import { celebrate } from 'celebrate';

import { ProfessionalSpecialtiesController } from '../controllers/professional-specialties';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { FindSpecialtiesByTypeSchema } from '../celebrate-schemas/specialty';

export const professionalSpecialtiesRouter = Router();
const professionalSpecialtiesController =
  new ProfessionalSpecialtiesController();

professionalSpecialtiesRouter.get(
  '/specialties',
  ensureAuthentication,
  professionalSpecialtiesController.index,
);

professionalSpecialtiesRouter.get(
  '/:professionalTypeId/specialties',
  ensureAuthentication,
  celebrate(FindSpecialtiesByTypeSchema),
  professionalSpecialtiesController.indexByProfessionalType,
);
