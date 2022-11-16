import { Router } from 'express';

import { SpecialtiesController } from '../controllers';
import { ensureAuthentication } from '../../users/middlewares';

export const specialtiesRouter = Router();
const specialtiesController = new SpecialtiesController();

specialtiesRouter.get(
  '/specialties',
  ensureAuthentication,
  specialtiesController.index,
);
