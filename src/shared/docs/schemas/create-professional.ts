export const createProfessionalSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    document: {
      type: 'string',
    },
    birthdate: {
      type: 'string',
    },
    phoneNumber: {
      type: 'string',
    },
    sex: {
      type: 'string',
    },
    specialtyId: {
      type: 'string',
    },
    specialtyRegistration: {
      type: 'string',
    },
    registration: {
      type: 'string',
    },
    registrationUf: {
      type: 'string',
    },
  },
  required: [
    'name',
    'email',
    'document',
    'specialtyId',
    'birthdate',
    'phoneNumber',
    'registration',
    'registrationUf',
  ],
};
