import { professionalTypeSchema } from './professional-type';

export const professionalSpecialtySchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        professionalTypeId: {
          type: 'string',
        },
        professionalType: professionalTypeSchema,
        name: {
          type: 'string',
        },
        description: {
          type: 'integer',
        },
        price: {
          type: 'integer',
        },
      },
    },
  ],
};
