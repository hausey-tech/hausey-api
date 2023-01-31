import { Joi, Segments } from 'celebrate';

export const CreateProfessionalAddressSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    addressLine1: Joi.string().max(50).required(),
    addressLine2: Joi.string().max(50),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipOrPostcode: Joi.string(),
    country: Joi.string().required(),
  }),
};
