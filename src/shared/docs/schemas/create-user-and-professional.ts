export const createUserAndProfessionalSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    cpf: {
      type: 'string',
    },
    professionalTypeId: {
      type: 'string',
    },
    professionalSpecialtyId: {
      type: 'string',
    },
    registrationUf: {
      type: 'string',
    },
    registration: {
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    birthdate: {
      type: 'string',
    },
    specialtyRegistration: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
  required: [
    'name',
    'email',
    'cpf',
    'professionalTypeId',
    'professionalSpecialtyId',
    'registrationUf',
    'registration',
    'phoneNumber',
    'birthdate',
  ],
};
