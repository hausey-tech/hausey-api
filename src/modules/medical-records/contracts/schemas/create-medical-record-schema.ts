import { Joi, Segments } from 'celebrate';

export const CreateMedicalRecordSchema = {
  [Segments.BODY]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    description: Joi.string().required(),
    cids: Joi.array().items(Joi.string()),
  }),
};
