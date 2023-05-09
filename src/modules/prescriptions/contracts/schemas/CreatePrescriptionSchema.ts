import { Joi, Segments } from 'celebrate';

export const CreatePrescriptionSchema = {
  [Segments.BODY]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    externalId: Joi.number().required(),
    token: Joi.string().required(),
  }),
};
