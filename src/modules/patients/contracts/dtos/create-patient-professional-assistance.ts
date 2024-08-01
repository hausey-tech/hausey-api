export interface ICreatePatientProfessionalAssistanceDto {
  patientId: string;
  roleId: string;
  assistanceType:
    | 'Grupo'
    | 'Individual'
    | 'Não Necessita'
    | 'Crítico'
    | 'Rotina';
  specialtyId?: string;
}
