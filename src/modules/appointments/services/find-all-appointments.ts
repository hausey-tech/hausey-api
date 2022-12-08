import { injectable, inject } from 'tsyringe';

import { Appointment } from '../entities/appointment';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

@injectable()
export class FindAllAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(withoutProfessional: string): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAll(
      withoutProfessional,
    );

    return appointments;
  }
}
