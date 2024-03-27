export interface ICreateMedicalRecordDTO {
  appointmentId: string;
  description: string;
  cids: string[];
  restricted?: boolean;
}
