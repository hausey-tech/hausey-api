import { userSchema } from './user';

export const patientSchema = {
  allOf: [
    {
      $ref: '#/schemas/base',
    },
    {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
        },
        user: userSchema,
        planId: {
          type: 'string',
        },
      },
    },
  ],
};
