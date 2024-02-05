import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateRoleSchema } from '../contracts/schemas/create-role-schema';
import { RolesController } from '../controllers/roles';

export const rolesRouter = Router();
const rolesController = new RolesController();

rolesRouter.get('/', ensureAuthentication, rolesController.index);
rolesRouter.get('/:roleType', ensureAuthentication, rolesController.findByType);
rolesRouter.post('/', celebrate(CreateRoleSchema), rolesController.create);
