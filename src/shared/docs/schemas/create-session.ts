export const createSessionSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
  required: ['email', 'password', 'role'],
};
