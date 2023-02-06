import { Joi, Segments } from 'celebrate';

export const DeletePrescriptionSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    externalId: Joi.number().required(),
  }),
};
