export const updateUserSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    cpf: {
      type: 'string',
    },
    birthdate: {
      type: 'string',
    },
    sex: {
      type: 'integer',
    },
    phoneNumber: {
      type: 'string',
    },
  },
};
