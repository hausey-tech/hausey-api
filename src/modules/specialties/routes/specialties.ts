import { Router } from 'express';
import { celebrate } from 'celebrate';

import { SpecialtiesController } from '../controllers/specialties';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { FindSpecialtiesSchema } from '../celebrate-schemas/specialty';

export const specialtiesRouter = Router();
const specialtiesController = new SpecialtiesController();

specialtiesRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindSpecialtiesSchema),
  specialtiesController.index,
);
