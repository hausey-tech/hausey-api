import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateGroupTypeSchema } from '../contracts/schemas/create-group-type-schema';
import { GroupTypesController } from '../controllers/group-types';

export const groupTypesRouter = Router();
const groupTypesController = new GroupTypesController();

groupTypesRouter.get('/', ensureAuthentication, groupTypesController.index);
groupTypesRouter.post(
  '/',
  celebrate(CreateGroupTypeSchema),
  groupTypesController.create,
);
