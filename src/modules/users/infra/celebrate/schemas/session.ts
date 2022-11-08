import { Joi, Segments } from 'celebrate';

const create = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required().equal('patient', 'professional', 'manager'),
  }),
};

// eslint-disable-next-line import/prefer-default-export
export { create };
