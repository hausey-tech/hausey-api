import { Router } from 'express';

import { ProgramsController } from '../controllers/programs';

export const programsRouter = Router();
const programsController = new ProgramsController();

programsRouter.get('/', programsController.index);
