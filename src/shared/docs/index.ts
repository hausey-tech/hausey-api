import {
  sessionsPath,
  usersPath,
  appointmentsPath,
  professionalsPath,
  programsPath,
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
  programSchema,
  baseSchema,
  createAppointmentSchema,
  priceSchema,
} from './schemas';
import { badRequest, unauthorized, notFound, serverError } from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Hausey API',
    description: 'Node.js API REST',
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
    {
      name: 'Programs',
    },
  ],
  paths: {
    '/sessions': sessionsPath,
    '/users': { ...usersPath, delete: undefined },
    '/users/{id}': { delete: usersPath.delete },
    '/professionals/specialties': professionalsPath.specialties,
    '/professionals/{typeId}/specialties': {
      get: professionalsPath.specialties.byTypeId,
    },
    '/appointments': { ...appointmentsPath, get: undefined },
    '/appointments/prices/{typeId}/{specialtyId}': appointmentsPath.prices,
    '/appointments/{id}': { get: appointmentsPath.get },
    '/appointments/slots/type/{typeId}': {
      get: appointmentsPath.slots.byTypeId,
    },
    '/appointments/slots/specialty/{specialtyId}': {
      get: appointmentsPath.slots.bySpecialtyId,
    },
    '/programs': programsPath,
  },
  schemas: {
    base: baseSchema,
    error: errorSchema,
    createSession: createSessionSchema,
    session: sessionSchema,
    createUser: createUserSchema,
    updateUser: updateUserSchema,
    user: userSchema,
    slot: slotSchema,
    appointment: appointmentSchema,
    createAppointment: createAppointmentSchema,
    specialty: specialtySchema,
    program: programSchema,
    price: priceSchema,
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
