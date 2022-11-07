import { Router } from 'express';
import UsersController from '@modules/users/controllers/UsersController';
import ensureAuthentication from '../middlewares/ensureAuthentication';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post('/', usersController.create);
usersRouter.get('/', ensureAuthentication, usersController.show);
usersRouter.patch('/:id', usersController.update);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
