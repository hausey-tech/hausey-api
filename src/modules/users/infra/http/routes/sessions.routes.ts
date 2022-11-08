import { Router } from 'express';
import { celebrate } from 'celebrate';

import { create } from '../../celebrate/schemas/session';
import SessionsController from '../../../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', celebrate(create), sessionsController.create);

export default sessionsRouter;
