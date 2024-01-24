import { Joi, Segments } from 'celebrate';

export const CreateClinicalResumeSchema = {
  [Segments.BODY]: Joi.object().keys({
    patientId: Joi.string().uuid().required(),
    professionalId: Joi.string().uuid().required(),
    terapeuticPlan: Joi.string().required(),
    clinicalResume: Joi.string().required(),
    categoryId: Joi.string().uuid().required(),
  }),
};
