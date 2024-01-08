import {
  sessionsPath,
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
  userSchema,
  slotSchema,
  appointmentSchema,
  specialtySchema,
  programSchema,
  baseSchema,
  createAppointmentSchema,
  priceSchema,
  createProfessionalSchema,
  professionalSchema,
  patientSchema,
  createAnamnesisAndPrimaryDiagnosisSchema,
  anamnesisAndPrimaryDiagnosisSchema,
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
      url: '/v1',
    },
  ],
  tags: [
    {
      name: 'Sessions',
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
    '/patients': patientsPath,
    '/professionals': professionalsPath,
    '/professionals/specialties': professionalsPath.specialties,
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
    '/appointments/anamneses': appointmentsPath.anamneses,
    '/appointments/primary-diagnoses': appointmentsPath.primaryDiagnoses,
    '/appointments/{appointmentId}/payments/toggle-paid':
      appointmentsPath.payments,
    '/appointments/specialties': appointmentsPath.specialties,
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
    updateUser: updateUserSchema,
    user: userSchema,
    slot: slotSchema,
    appointment: appointmentSchema,
    createAppointment: createAppointmentSchema,
    specialty: specialtySchema,
    program: programSchema,
    price: priceSchema,
    createProfessional: createProfessionalSchema,
    professional: professionalSchema,
    patient: patientSchema,
    createAnamnesisAndPrimaryDiagnosis:
      createAnamnesisAndPrimaryDiagnosisSchema,
    anamnesisAndPrimaryDiagnosis: anamnesisAndPrimaryDiagnosisSchema,
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
