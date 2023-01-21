import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { PatientsController } from '../controllers/patients';

export const patientsRouter = Router();
const patientsController = new PatientsController();

patientsRouter.get('/patients', ensureAuthentication, patientsController.index);
