import { Joi, Segments } from 'celebrate';

export const CreateRoleSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().required(),
  }),
};
