import { Joi, Segments } from 'celebrate';

export const CreateGroupTypeSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    roleId: Joi.string().uuid().required(),
  }),
};
