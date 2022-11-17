import { sessionsPath, usersPath } from './paths';
import {
  errorSchema,
  createSessionSchema,
  sessionSchema,
  createUserSchema,
  userSchema,
  bearerAuthSchema,
} from './schemas';
import { badRequest, unauthorized, notFound, serverError } from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Hausey API',
    description: 'Hausey node.js API rest',
    version: '1.0.0',
  },
  license: {
    name: 'GPL-3.0-or-later',
    url: 'https://spdx.org/licenses/GPL-3.0-or-later.html',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Sessions',
    },
    {
      name: 'Users',
    },
  ],
  paths: {
    '/sessions': sessionsPath,
    '/users': usersPath,
  },
  schemas: {
    error: errorSchema,
    createSession: createSessionSchema,
    session: sessionSchema,
    createUser: createUserSchema,
    user: userSchema,
  },
  components: {
    securitySchemes: {
      bearerAuth: bearerAuthSchema,
    },
    badRequest,
    unauthorized,
    serverError,
    notFound,
  },
};
