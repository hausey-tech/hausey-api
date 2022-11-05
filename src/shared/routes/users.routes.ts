import { Router } from 'express';
import UsersController from '../../modules/users/controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', usersController.index);
usersRouter.post('/', usersController.create);
usersRouter.get('/:id', usersController.read);
usersRouter.patch('/:id', usersController.update);
usersRouter.delete('/:id', usersController.softDelete);

export default usersRouter;
