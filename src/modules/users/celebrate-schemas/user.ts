import { Joi, Segments } from 'celebrate';

export const ListUserSchema = {
  [Segments.QUERY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
  }),
};

export const CreateUserSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    document: Joi.string(),
    phoneNumber: Joi.string().required(),
    roleType: Joi.string().required(),
    sex: Joi.string().equal('M', 'F'),
  }),
};

export const UpdateUserSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    document: Joi.string(),
    birthdate: Joi.string(),
    sex: Joi.string().equal('M', 'F'),
  }),
};

export const GetUserInfosSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
};
