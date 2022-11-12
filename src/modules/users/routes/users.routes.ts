import { Router } from 'express';
import { celebrate } from 'celebrate';

import UsersController from '../controllers/UsersController';

import { create, update } from '../celebrate-schemas/user';

import ensureAuthentication from '../middlewares/ensureAuthentication';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', celebrate(create), usersController.create);
usersRouter.get('/', ensureAuthentication, usersController.show);
usersRouter.patch(
  '/',
  ensureAuthentication,
  celebrate(update),
  usersController.update,
);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
