import { Joi, Segments } from 'celebrate';

export const CreateSlotSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
    weekDay: Joi.number().required().equal(0, 1, 2, 3, 4, 5, 6),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  }),
};
