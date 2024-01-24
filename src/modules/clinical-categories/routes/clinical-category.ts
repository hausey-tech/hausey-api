import { celebrate } from 'celebrate';
import { Router } from 'express';

import { ensureAuthentication } from '../../../shared/middlewares/ensure-authentication';
import { CreateClinicalCategorychema } from '../contracts/schemas/create-clinical-category-schema';
import { ClinicalCategoryController } from '../controllers/clinical-categories';

export const clinicalCategoryRouter = Router();
const clinicalCategoryController = new ClinicalCategoryController();

clinicalCategoryRouter.get(
  '/',
  ensureAuthentication,
  clinicalCategoryController.index,
);
clinicalCategoryRouter.post(
  '/',
  celebrate(CreateClinicalCategorychema),
  clinicalCategoryController.create,
);
