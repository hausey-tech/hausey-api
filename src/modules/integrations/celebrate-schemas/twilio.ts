import { Joi, Segments } from 'celebrate';

export const CreateRoomSchema = {
  [Segments.BODY]: Joi.object().keys({
    identity: Joi.string().required(),
    room: Joi.string(),
  }),
};
