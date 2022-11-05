import { Router } from 'express';
import UsersController from '../../modules/users/controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', usersController.index);
usersRouter.post('/', usersController.create);
usersRouter.get('/:id', usersController.read);

export default usersRouter;
