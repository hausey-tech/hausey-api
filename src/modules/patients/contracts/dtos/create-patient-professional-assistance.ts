export interface ICreatePatientProfessionalAssistanceDto {
  patientId: string;
  roleId: string;
  assistanceType: 'Grupo' | 'Individual';
}
