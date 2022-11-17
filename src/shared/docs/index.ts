import {
  sessionsPath,
  usersPath,
  appointmentsPath,
  professionalsPath,
} from './paths';
import {
  errorSchema,
  bearerAuthSchema,
  createSessionSchema,
  sessionSchema,
  updateUserSchema,
  createUserSchema,
  userSchema,
  slotSchema,
  appointmentSchema,
  specialtySchema,
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
    {
      name: 'Professionals',
    },
    {
      name: 'Appointments',
    },
  ],
  paths: {
    '/sessions': sessionsPath,
    '/users': { ...usersPath, delete: undefined },
    '/users/{id}': { delete: usersPath.delete },
    '/professionals/specialties': professionalsPath.specialties,
    '/appointments/{id}': appointmentsPath,
    '/appointments/slots/{specialtyId}': appointmentsPath.slots,
  },
  schemas: {
    error: errorSchema,
    createSession: createSessionSchema,
    session: sessionSchema,
    createUser: createUserSchema,
    updateUser: updateUserSchema,
    user: userSchema,
    slot: slotSchema,
    appointment: appointmentSchema,
    specialty: specialtySchema,
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
