import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreateUserAndPatientSchema } from '../celebrate-schemas/patient';
import { PatientsController } from '../controllers/patients';

export const patientsRouter = Router();
const patientsController = new PatientsController();

patientsRouter.post(
  '/',
  celebrate(CreateUserAndPatientSchema),
  patientsController.create,
);
