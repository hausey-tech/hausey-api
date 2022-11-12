import { Joi, Segments } from 'celebrate';

export const CreateSessionSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .required()
      .equal('patient', 'professional', 'manager', 'debug'),
  }),
};
