import { Joi, Segments } from 'celebrate';

const create = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const update = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
  }),
};

export { create, update };
