import {
  sessionsPath,
  usersPath,
  appointmentsPath,
  professionalsPath,
  programsPath,
  patientsPath,
  integrationsPath,
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
  createUserAndPatientSchema,
  patientSessionSchema,
  memedUserSchema,
  createMemedUserSchema,
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
      url: '/',
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
      name: 'Integrations',
    },
    {
      name: 'Programs',
    },
  ],
  paths: {
    '/sessions': sessionsPath,
    '/users': { ...usersPath, delete: undefined },
    '/users/{id}': { delete: usersPath.delete },
    '/patients': patientsPath,
    '/patients/anamneses': patientsPath.anamneses,
    '/patients/primary-diagnoses': patientsPath.primaryDiagnoses,
    '/professionals': professionalsPath,
    '/professionals/types': professionalsPath.types,
    '/professionals/specialties': professionalsPath.specialties,
    '/professionals/specialties/{typeId}': {
      get: professionalsPath.specialties.byTypeId,
    },
    '/appointments': appointmentsPath,
    '/appointments/patients': appointmentsPath.patients,
    '/appointments/professionals/{professionalId}': {
      ...appointmentsPath.professionals,
      post: undefined,
    },
    '/appointments/professionals': {
      post: appointmentsPath.professionals.post,
    },
    '/appointments/prices/{typeId}/{specialtyId}': appointmentsPath.prices,
    '/appointments/slots/{uuid}': appointmentsPath.slots,
    '/appointments/{appointmentId}/files': appointmentsPath.files,
    '/programs': programsPath,
    '/integrations/twilio': integrationsPath.twilio,
    '/integrations/memed/prescriptions/users': {
      ...integrationsPath.memed.prescriptions.users,
      get: undefined,
    },
    '/integrations/memed/prescriptions/users/{token}': {
      get: integrationsPath.memed.prescriptions.users.get,
    },
    '/integrations/memed/users/{token}': integrationsPath.memed.users,
    '/integrations/s3/files/{key}': integrationsPath.s3,
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
    createUserAndPatient: createUserAndPatientSchema,
    patientSession: patientSessionSchema,
    memedUser: memedUserSchema,
    createMemedUser: createMemedUserSchema,
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
