import { professionalTypeSchema } from './professional-type';
import { specialtySchema } from './specialty';
import { userSchema } from './user';

export const professionalSchema = {
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
        professionalSpecialtyId: {
          type: 'string',
        },
        professionalSpecialty: specialtySchema,
        registration: {
          type: 'string',
        },
        registrationUf: {
          type: 'string',
        },
        professionalTypeId: {
          type: 'string',
        },
        professionalType: professionalTypeSchema,
        specialtyRegistration: {
          type: 'string',
        },
      },
    },
  ],
};
