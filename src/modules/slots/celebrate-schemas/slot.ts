import { Joi, Segments } from 'celebrate';

export const FindSlotsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    professionalId: Joi.string().uuid(),
    days: Joi.number().min(1).max(30),
  }),
};
export const DeleteSlotSchema = {
  [Segments.QUERY]: Joi.object().keys({
    slotId: Joi.string().uuid(),
  }),
};

export const CreateSlotSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
    slots: Joi.array()
      .items(
        Joi.object()
          .keys({
            date: Joi.string().required(),
            times: Joi.array()
              .items(
                Joi.object()
                  .keys({
                    startTime: Joi.string().required(),
                    endTime: Joi.string().required(),
                  })
                  .required(),
              )
              .required(),
          })
          .required(),
      )
      .required(),
  }),
};
