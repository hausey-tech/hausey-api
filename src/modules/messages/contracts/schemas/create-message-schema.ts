import { Joi, Segments } from 'celebrate';

export const CreateMessageSchema = {
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().valid('inApp', 'push').required(),
    to: Joi.string().valid('produtor', 'varejista', 'todos').required(),
    title: Joi.string(),
    body: Joi.string(),
    startsAt: Joi.string(),
    expiresAt: Joi.string(),
  }),
};
