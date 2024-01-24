import { Router } from 'express';

import { celebrate } from 'celebrate';
import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { MedicalRecordsController } from '../controllers/medical-records-controller';
import { CreateMedicalRecordSchema } from '../contracts/schemas/create-medical-record-schema';
import { ListMedicalRecordsSchema } from '../contracts/schemas/list-medical-records-schema';

export const medicalRecordsRouter = Router();
const medicalRecordsController = new MedicalRecordsController();

medicalRecordsRouter.get(
  '/',
  ensureAuthentication,
  celebrate(ListMedicalRecordsSchema),
  medicalRecordsController.index,
);

medicalRecordsRouter.post(
  '/',
  ensureAuthentication,
  celebrate(CreateMedicalRecordSchema),
  medicalRecordsController.create,
);
