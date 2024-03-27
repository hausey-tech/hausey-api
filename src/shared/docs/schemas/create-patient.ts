export const createUserAndPatientSchema = {
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
      type: 'M' || 'F',
    },
    sellerCode: {
      type: 'string',
    },
  },
  required: ['email', 'password', 'name', 'phoneNumber'],
};
