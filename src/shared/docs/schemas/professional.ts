import { specialtySchema } from './specialty';

export const professionalSchema = {
  allOf: [
    {
      $ref: '#/schemas/user',
    },
    {
      type: 'object',
      properties: {
        specialtyId: {
          type: 'string',
        },
        specialty: specialtySchema,
        specialtyRegistration: {
          type: 'string',
        },
        registration: {
          type: 'string',
        },
        registrationUf: {
          type: 'string',
        },
        memedStatus: {
          type: 'string',
        },
      },
    },
  ],
};
