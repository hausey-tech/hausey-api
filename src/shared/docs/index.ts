import { sessionsPath } from './paths';
import { createSessionSchema, errorSchema, sessionSchema } from './schemas';
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
      name: 'User',
    },
  ],
  paths: {
    '/sessions': sessionsPath,
  },
  schemas: {
    createSession: createSessionSchema,
    session: sessionSchema,
    error: errorSchema,
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound,
  },
};
