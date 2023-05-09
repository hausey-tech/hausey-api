import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { Patient } from '../entities/patient';

@injectable()
export class ListPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(query: { professionalId?: string }): Promise<Patient[]> {
    const { professionalId } = query;

    if (professionalId) {
      const appointments = await this.appointmentsRepository.findByProfessional(
        professionalId,
      );

      const patientIds = appointments.map(appointment => appointment.patientId);

      const patients = this.patientsRepository.findByIds(patientIds);

      return patients;
    }

    const patients = this.patientsRepository.find();

    return patients;
  }
}
