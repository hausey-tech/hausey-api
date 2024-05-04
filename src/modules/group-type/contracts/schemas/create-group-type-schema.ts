import { Joi, Segments } from 'celebrate';

export const CreateGroupTypeSchema = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    roleId: Joi.string().uuid().required(),
  }),
};
export const UpdateGroupTypeSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    groupTypeId: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    roleId: Joi.string().uuid(),
  }),
};
