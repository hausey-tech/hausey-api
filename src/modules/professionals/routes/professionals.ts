import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  CreateProfessionalSchema,
  DeleteProfessionalSchema,
  FindProfessionalsSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdatePasswordSchema,
  UpdateProfessionalSchema,
  VerifyTokenSchema,
} from '../celebrate-schemas/professional';
import { ProfessionalsController } from '../controllers/professionals';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';

export const professionalsRouter = Router();
const professionalsController = new ProfessionalsController();

professionalsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(FindProfessionalsSchema),
  professionalsController.index,
);

professionalsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateProfessionalSchema),
  professionalsController.create,
);

professionalsRouter.patch(
  '/:professionalId',
  ensureAuthentication,
  celebrate(UpdateProfessionalSchema),
  professionalsController.update,
);

professionalsRouter.get(
  '/:professionalId/delete',
  ensureAuthentication,
  celebrate(DeleteProfessionalSchema),
  professionalsController.delete,
);

professionalsRouter.post(
  '/update-password',
  ensureAuthentication,
  celebrate(UpdatePasswordSchema),
  professionalsController.updatePassword,
);

professionalsRouter.post(
  '/forgot-password',
  celebrate(ForgotPasswordSchema),
  professionalsController.forgotPassword,
);

professionalsRouter.post(
  '/verify-token',
  celebrate(VerifyTokenSchema),
  professionalsController.verifyToken,
);

professionalsRouter.post(
  '/reset-password',
  celebrate(ResetPasswordSchema),
  professionalsController.resetPassword,
);
