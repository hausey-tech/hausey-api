import { Joi, Segments } from 'celebrate';

export const CreatePrimaryDiagnosisSchema = {
  [Segments.BODY]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    description: Joi.string().required(),
  }),
};
