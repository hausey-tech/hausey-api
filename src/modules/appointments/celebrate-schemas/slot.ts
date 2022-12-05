import { Joi, Segments } from 'celebrate';

export const FindSlotsSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    uuid: Joi.string().uuid(),
  }),
  [Segments.QUERY]: Joi.object().keys({
    filterBy: Joi.string().equal('type', 'specialty'),
    days: Joi.number().max(30),
  }),
};

export const CreateSlotSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
    weekDay: Joi.number().required().equal(1, 2, 3, 4, 5, 6, 7),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  }),
};
