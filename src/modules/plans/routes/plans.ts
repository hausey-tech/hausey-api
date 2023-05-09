import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreatePlanSchema } from '../contracts/schemas/create-plan-schema';
import { PlansController } from '../controllers/plans';

export const plansRouter = Router();
const plansController = new PlansController();

plansRouter.get('/', ensureAuthentication, plansController.index);
plansRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreatePlanSchema),
  plansController.create,
);
