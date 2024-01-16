import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  ListUserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  GetUserInfosSchema,
} from '../celebrate-schemas/user';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { cors } from '../../../shared/middlewares/cors';
import { UsersController } from '../controllers/users';

export const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get(
  '/',
  ensureAuthentication,
  celebrate(ListUserSchema),
  usersController.index,
);

usersRouter.post(
  '/',
  cors,
  celebrate(CreateUserSchema),
  usersController.create,
);

usersRouter.patch(
  '/:userId',
  ensureAuthentication,
  celebrate(UpdateUserSchema),
  usersController.update,
);

usersRouter.get(
  '/:userId',
  ensureAuthentication,
  celebrate(GetUserInfosSchema),
  usersController.getInfos,
);
