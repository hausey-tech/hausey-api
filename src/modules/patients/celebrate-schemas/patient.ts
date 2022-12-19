import { Joi, Segments } from 'celebrate';

export const CreateUserAndPatientSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
