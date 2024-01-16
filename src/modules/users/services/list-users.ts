import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { IUsersRepository } from '../contracts/repositories/users';
import { User } from '../entities/user';

@injectable()
export class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(query: { professionalId?: string }): Promise<User[]> {
    const { professionalId } = query;

    if (professionalId) {
      const appointments = await this.appointmentsRepository.findByProfessional(
        professionalId,
      );

      const patientIds = appointments.map(appointment => appointment.patientId);

      const patients = this.usersRepository.findByIds(patientIds);

      return patients;
    }

    const patients = this.usersRepository.find();

    return patients;
  }
}
