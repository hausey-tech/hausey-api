import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  ListPatientsSchema,
  CreatePatientSchema,
  UpdatePatientSchema,
  GetPatientInfosSchema,
  CreatePatientGroupSchema,
  CreatePatientProfessionalAssistanceSchema,
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
  '/patient-group',
  ensureAuthentication,
  celebrate(CreatePatientGroupSchema),
  patientsController.createPatientGroup,
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

patientsRouter.get(
  '/:patientId',
  ensureAuthentication,
  celebrate(GetPatientInfosSchema),
  patientsController.getInfos,
);
