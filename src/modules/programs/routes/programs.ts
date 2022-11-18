import { Router } from 'express';

import { ensureAuthentication } from '../../users/middlewares/ensure-authentication';
import { ProgramsController } from '../controllers/programs';

export const programsRouter = Router();
const programsController = new ProgramsController();

programsRouter.get('/', ensureAuthentication, programsController.index);
