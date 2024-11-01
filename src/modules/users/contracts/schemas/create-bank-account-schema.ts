import { Joi, Segments } from 'celebrate';

export const CreateBankAccountSchema = {
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().uuid().required(),
    bankAccount: Joi.object().keys({
      holderName: Joi.string().max(30).required(),
      bank: Joi.string().max(3).required(),
      branchNumber: Joi.string().max(4).required(),
      branchCheckDigit: Joi.string().empty('').max(1),
      accountNumber: Joi.string().max(13).required(),
      accountCheckDigit: Joi.string().max(2).required(),
      holderType: Joi.string().valid('individual', 'company').required(),
      holderDocument: Joi.string().required(),
      type: Joi.string().valid('checking', 'savings').required(),
    }),
  }),
};
