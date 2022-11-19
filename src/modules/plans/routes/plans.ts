import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { PlansController } from '../controllers/plans';

export const plansRouter = Router();
const plansController = new PlansController();

plansRouter.get('/', ensureAuthentication, plansController.index);
