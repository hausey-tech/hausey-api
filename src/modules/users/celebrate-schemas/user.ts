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
    discounts: Joi.array().items(
      Joi.object().keys({
        planId: Joi.string().required(),
        discount: Joi.number().required(),
      }),
    ),
    sellers: Joi.array().items(
      Joi.object().keys({
        sellerId: Joi.string().required(),
        fee: Joi.number().required(),
      }),
    ),
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
    bankAccount: Joi.object().keys({
      holder_name: Joi.string().max(30).required(),
      bank: Joi.string().max(3).required(),
      branch_number: Joi.string().max(4).required(),
      branch_check_digit: Joi.string().max(1),
      account_number: Joi.string().max(13).required(),
      account_check_digit: Joi.string().max(2).required(),
      holder_type: Joi.string().valid('individual', 'company').required(),
      holder_document: Joi.string().required(),
      type: Joi.string().valid('checking', 'savings').required(),
    }),
  }),
};

export const GetUserInfosSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
};
