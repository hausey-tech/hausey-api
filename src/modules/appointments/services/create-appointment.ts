import { injectable, inject } from 'tsyringe';

import { ICreateAppointmentDTO } from '../contracts/dtos/create-appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Appointment } from '../entities/appointment';
import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

@injectable()
export class CreateAppointmentService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(payload: ICreateAppointmentDTO): Promise<Appointment> {
    const { patientId, professionalTypeId, professionalSpecialtyId, date } =
      payload;

    const patient = await this.patientsRepository.findByUserId(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const appointment = await this.appointmentsRepository.create({
      patientId: patient.id,
      professionalTypeId,
      professionalSpecialtyId,
      date,
    });

    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}
