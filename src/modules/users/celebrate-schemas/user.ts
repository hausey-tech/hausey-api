import { Joi, Segments } from 'celebrate';

export const CreateUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const UpdateUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string(),
    name: Joi.string(),
    cpf: Joi.string(),
    birthdate: Joi.string(),
    sex: Joi.number().equal(0, 1, 2, 9),
    phoneNumber: Joi.string(),
  }),
};
