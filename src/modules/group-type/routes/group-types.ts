import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import {
  CreateGroupTypeSchema,
  UpdateGroupTypeSchema,
} from '../contracts/schemas/create-group-type-schema';
import { GroupTypesController } from '../controllers/group-types';
import { FindAllGroupTypesSchema } from '../contracts/schemas/find-all-group-types-schema';

export const groupTypesRouter = Router();
const groupTypesController = new GroupTypesController();

groupTypesRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindAllGroupTypesSchema),
  groupTypesController.index,
);
groupTypesRouter.post(
  '/',
  celebrate(CreateGroupTypeSchema),
  groupTypesController.create,
);
groupTypesRouter.patch(
  '/:groupTypeId/update',
  celebrate(UpdateGroupTypeSchema),
  groupTypesController.update,
);

groupTypesRouter.get(
  '/:groupTypeId/delete',
  celebrate(UpdateGroupTypeSchema),
  groupTypesController.delete,
);
