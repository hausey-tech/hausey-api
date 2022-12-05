import { Router } from 'express';

import { ProfessionalTypesController } from '../controllers/professional-types';
import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';

export const professionalTypesRouter = Router();
const professionalTypesController = new ProfessionalTypesController();

professionalTypesRouter.get(
  '/types',
  ensureAuthentication,
  professionalTypesController.index,
);
