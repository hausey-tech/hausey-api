import { Joi, Segments } from 'celebrate';

export const CreatePrescriptionSchema = {
  [Segments.BODY]: Joi.object().keys({
    appointmentId: Joi.string().uuid().required(),
    externalId: Joi.number().required(),
    token: Joi.string().required(),
  }),
};

export const DeletePrescriptionSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    externalId: Joi.number().required(),
  }),
};
