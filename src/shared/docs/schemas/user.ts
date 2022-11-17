export const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    deletedAt: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    email: {
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
