import { Joi, Segments } from 'celebrate';

export const CreateMessageSchema = {
  [Segments.BODY]: Joi.object().keys({
    type: Joi.string().valid('inApp', 'push').required(),
    to: Joi.string().required(),
    title: Joi.string(),
    body: Joi.string(),
    link: Joi.string(),
    startsAt: Joi.string(),
    expiresAt: Joi.string(),
  }),
};
