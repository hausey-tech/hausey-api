import { userSchema } from './user';

export const sessionSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
    },
    refreshToken: {
      type: 'string',
    },
    user: userSchema,
  },
};
