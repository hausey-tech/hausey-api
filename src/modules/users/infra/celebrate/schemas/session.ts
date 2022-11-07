import { Joi, Segments } from 'celebrate';

const create = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

// eslint-disable-next-line import/prefer-default-export
export { create };
