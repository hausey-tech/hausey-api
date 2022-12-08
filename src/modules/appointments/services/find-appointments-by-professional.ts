import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class FindAppointmentsByProfessionalService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(professionalId: string): Promise<Appointment[]> {
    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    return this.appointmentsRepository.findByProfessional(professionalId);
  }
}
