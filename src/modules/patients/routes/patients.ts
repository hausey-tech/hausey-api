import { celebrate } from 'celebrate';
import { Router } from 'express';

import {
  CreatePatientSchema,
  UpdatePatientSchema,
} from '../celebrate-schemas/patient';
import { PatientsController } from '../controllers/patients';

export const patientsRouter = Router();
const patientsController = new PatientsController();

patientsRouter.post(
  '/',
  celebrate(CreatePatientSchema),
  patientsController.create,
);

patientsRouter.patch(
  '/:patientId',
  celebrate(UpdatePatientSchema),
  patientsController.update,
);
