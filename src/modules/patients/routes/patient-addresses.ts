import { celebrate } from 'celebrate';
import { Router } from 'express';

import { CreatePatientAddressSchema } from '../celebrate-schemas/patient-address';
import { PatientAddressesController } from '../controllers/patient-addresses';

export const patientAddressesRouter = Router();
const patientAddressesController = new PatientAddressesController();

patientAddressesRouter.post(
  '/:patientId/addresses',
  celebrate(CreatePatientAddressSchema),
  patientAddressesController.create,
);
