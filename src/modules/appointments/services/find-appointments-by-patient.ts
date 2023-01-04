import { injectable, inject } from 'tsyringe';

import { IPatientsRepository } from '../../patients/contracts/repositories/patients';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class FindAppointmentsByPatientService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(id: string): Promise<Appointment[]> {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    return this.appointmentsRepository.findByPatient(patient.id);
  }
}
