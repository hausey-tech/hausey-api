import { celebrate } from 'celebrate';
import { Router } from 'express';
import { upload } from '../../../shared/utils';
import {
  ListPatientsSchema,
  CreatePatientSchema,
  UpdatePatientSchema,
  GetPatientInfosSchema,
  CreatePatientGroupSchema,
  CreatePatientProfessionalAssistanceSchema,
  GetPatientsByGroupSchema,
  CreateForwardRequestSchema,
  ForgotPasswordSchema,
  VerifyTokenSchema,
  ResetPasswordSchema,
  GetGroupByPatientSchema,
  UpdatePatientPlanSchema,
  CreateSubscriptionSchema,
  GetPatientFilesSchema,
  DeletePatientFileSchema,
  DeletePatientGroupTypeSchema,
} from '../celebrate-schemas/patient';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { PatientsController } from '../controllers/patients';

export const patientsRouter = Router();
const patientsController = new PatientsController();

patientsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(ListPatientsSchema),
  patientsController.index,
);

patientsRouter.post(
  '/',
  celebrate(CreatePatientSchema),
  patientsController.create,
);
patientsRouter.post(
  '/get-patients-by-group',
  celebrate(GetPatientsByGroupSchema),
  patientsController.getPatientsByGroup,
);
patientsRouter.get(
  '/get-group-by-patient',
  celebrate(GetGroupByPatientSchema),
  patientsController.getGroupsByPatient,
);

patientsRouter.get(
  '/:patientId/patient-files',
  ensureAuthentication,
  celebrate(GetPatientFilesSchema),
  patientsController.getPatientFiles,
);

patientsRouter.delete(
  '/:id/patient-files',
  ensureAuthentication,
  celebrate(DeletePatientFileSchema),
  patientsController.deletePatientFile,
);

patientsRouter.post(
  '/:patientId/patient-files',
  ensureAuthentication,
  // celebrate(CreatePatientFileSchema),
  upload.single('file'),
  patientsController.createPatientFile,
);

patientsRouter.post(
  '/patient-group',
  ensureAuthentication,
  celebrate(CreatePatientGroupSchema),
  patientsController.createPatientGroup,
);
patientsRouter.delete(
  '/patient-group-types/:patientGroupTypeId',
  ensureAuthentication,
  celebrate(DeletePatientGroupTypeSchema),
  patientsController.deletePatientGroupType,
);
patientsRouter.post(
  '/forward-request',
  ensureAuthentication,
  celebrate(CreateForwardRequestSchema),
  patientsController.createForwardRequest,
);
patientsRouter.post(
  '/patient-professional-assistance',
  ensureAuthentication,
  celebrate(CreatePatientProfessionalAssistanceSchema),
  patientsController.createPatientProfessionalAssistance,
);

patientsRouter.patch(
  '/:patientId',
  ensureAuthentication,
  celebrate(UpdatePatientSchema),
  patientsController.update,
);
patientsRouter.patch(
  '/:patientId/plan',
  ensureAuthentication,
  celebrate(UpdatePatientPlanSchema),
  patientsController.updatePlan,
);

patientsRouter.get(
  '/:patientId',
  ensureAuthentication,
  celebrate(GetPatientInfosSchema),
  patientsController.getInfos,
);

patientsRouter.post(
  '/forgot-password',
  celebrate(ForgotPasswordSchema),
  patientsController.forgotPassword,
);
patientsRouter.post(
  '/verify-token',
  celebrate(VerifyTokenSchema),
  patientsController.verifyToken,
);
patientsRouter.post(
  '/reset-password',
  celebrate(ResetPasswordSchema),
  patientsController.resetPassword,
);
patientsRouter.post(
  '/subscriptions',
  celebrate(CreateSubscriptionSchema),
  patientsController.createSubscription,
);
