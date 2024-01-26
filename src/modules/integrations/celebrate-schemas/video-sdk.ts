import { Joi, Segments } from 'celebrate';

export const CreateAuthTokenSchema = {
  [Segments.BODY]: Joi.object().keys({
    room: Joi.string().required(),
  }),
};
