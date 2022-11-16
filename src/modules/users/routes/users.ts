import { Router } from 'express';
import { celebrate } from 'celebrate';

import { ensureAuthentication } from '../middlewares/ensure-authentication';
import { CreateUserSchema, UpdateUserSchema } from '../celebrate-schemas/user';
import { UsersController } from '../controllers/users';

export const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', celebrate(CreateUserSchema), usersController.create);
usersRouter.get('/', ensureAuthentication, usersController.show);
usersRouter.patch(
  '/',
  ensureAuthentication,
  celebrate(UpdateUserSchema),
  usersController.update,
);
usersRouter.delete('/:id', usersController.delete);
