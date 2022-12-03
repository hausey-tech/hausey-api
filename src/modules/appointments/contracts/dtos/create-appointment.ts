export interface ICreateAppointmentDTO {
  patientId: string;
  professionalTypeId?: string;
  professionalSpecialtyId?: string;
  date: string;
}
