import { injectable, inject } from 'tsyringe';
import { IPatientsRepository } from 'modules/patients/contracts/repositories/patients';
import { IAppointmentsRepository } from 'modules/appointments/contracts/repositories/appointments';
import { AppError } from '../../../shared/errors/app-error';
import { MedicalRecord } from '../entities/medical-record';
import { IListMedicalRecordsDTO } from '../contracts/dtos/list-medical-records-dto';

@injectable()
export class ListMedicalRecordsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    patientId,
  }: IListMedicalRecordsDTO): Promise<MedicalRecord[]> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const appointments = await this.appointmentsRepository.findByPatient(
      patientId,
    );

    const filteredAppointments = appointments.filter(
      appointment => appointment.medicalRecord !== null,
    );

    const medicalRecords = filteredAppointments.map(
      appointment => appointment.medicalRecord,
    );

    return medicalRecords;
  }
}
