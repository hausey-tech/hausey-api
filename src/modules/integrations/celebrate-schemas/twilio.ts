import { Joi, Segments } from 'celebrate';

export const CreateRoomSchema = {
  [Segments.BODY]: Joi.object().keys({
    identify: Joi.string().required(),
    room: Joi.string(),
  }),
};
