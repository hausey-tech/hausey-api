export const updateUserSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    document: {
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
