import { injectable, inject } from 'tsyringe';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { AppError } from '../../../shared/errors/app-error';
import { MedicalRecord } from '../entities/medical-record';
import { ICreateMedicalRecordDTO } from '../contracts/dtos/create-medical-record-dto';
import { IMedicalRecordsRepository } from '../contracts/repositories/medical-records-repository';
import { IMedicalRecordCidsRepository } from '../contracts/repositories/medical-record-cids-repository';

@injectable()
export class CreateMedicalRecordService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('MedicalRecordsRepository')
    private medicalRecordsRepository: IMedicalRecordsRepository,

    @inject('MedicalRecordCidsRepository')
    private medicalRecordCidsRepository: IMedicalRecordCidsRepository,
  ) {}

  public async execute({
    appointmentId,
    description,
    cids,
    restricted,
  }: ICreateMedicalRecordDTO): Promise<MedicalRecord> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const medicalRecordCids = [];
    Promise.all(
      cids.map(async cid => {
        const medicalRecordCid = await this.medicalRecordCidsRepository.create({
          cid,
        });
        medicalRecordCids.push(medicalRecordCid);
      }),
    );

    const medicalRecord = await this.medicalRecordsRepository.create({
      description,
      restricted,
    });
    medicalRecord.cids = medicalRecordCids;
    await this.medicalRecordsRepository.save(medicalRecord);

    appointment.medicalRecord = medicalRecord;
    await this.appointmentsRepository.save(appointment);

    return medicalRecord;
  }
}
