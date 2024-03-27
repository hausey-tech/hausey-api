import { Joi, Segments } from 'celebrate';

export const FindSlotsSchema = {
  [Segments.QUERY]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
    days: Joi.number().min(1).max(30),
  }),
};

export const CreateSlotSchema = {
  [Segments.BODY]: Joi.object().keys({
    professionalId: Joi.string().uuid().required(),
    slots: Joi.array()
      .items(
        Joi.object()
          .keys({
            weekDay: Joi.number().equal(1, 2, 3, 4, 5, 6, 7).required(),
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
