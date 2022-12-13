import {
  sessionsPath,
  usersPath,
  appointmentsPath,
  professionalsPath,
  programsPath,
  patientsPath,
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
  professionalTypeSchema,
  createUserAndProfessionalSchema,
  professionalSchema,
  patientSchema,
  createPatientAnamnesisSchema,
  patientAnamnesisSchema,
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
      name: 'Patients',
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
    '/patients/anamneses': patientsPath.anamneses,
    '/professionals': professionalsPath,
    '/professionals/types': professionalsPath.types,
    '/professionals/specialties': professionalsPath.specialties,
    '/professionals/specialties/{typeId}': {
      get: professionalsPath.specialties.byTypeId,
    },
    '/appointments': appointmentsPath,
    '/appointments/professionals/{professionalId}':
      appointmentsPath.professionals,
    '/appointments/prices/{typeId}/{specialtyId}': appointmentsPath.prices,
    '/appointments/{id}': appointmentsPath.withId,
    '/appointments/slots/{uuid}': appointmentsPath.slots,
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
    professionalType: professionalTypeSchema,
    createUserAndProfessional: createUserAndProfessionalSchema,
    professional: professionalSchema,
    patient: patientSchema,
    createPatientAnamnesis: createPatientAnamnesisSchema,
    patientAnamnesis: patientAnamnesisSchema,
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
