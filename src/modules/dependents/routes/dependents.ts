import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { DependentsController } from '../controllers/dependents';
import {
  AcceptInviteSchema,
  AddDependentSchema,
  GetHolderByDependentSchema,
  RemoveDependentSchema,
  ResendInviteSchema,
} from '../celebrate-schemas/dependents';

export const dependentsRouter = Router();
const dependentsController = new DependentsController();

dependentsRouter.post(
  '/accept-invite',
  celebrate(AcceptInviteSchema),
  dependentsController.acceptInvite,
);

dependentsRouter.use(ensureAuthentication);

dependentsRouter.post(
  '/',
  celebrate(AddDependentSchema),
  dependentsController.add,
);

dependentsRouter.get('/', dependentsController.list);

dependentsRouter.delete(
  '/:id',
  celebrate(RemoveDependentSchema),
  dependentsController.remove,
);

dependentsRouter.post(
  '/:id/resend-invite',
  celebrate(ResendInviteSchema),
  dependentsController.resendInvite,
);

dependentsRouter.get(
  '/holder/:dependentPatientId',
  celebrate(GetHolderByDependentSchema),
  dependentsController.getHolderByDependent,
);
