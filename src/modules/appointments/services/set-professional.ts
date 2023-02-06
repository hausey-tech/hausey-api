import { injectable, inject } from 'tsyringe';

import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { ISetProfessionalDTO } from '../contracts/dtos/set-professional';
import { Appointment } from '../entities/appointment';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class SetProfessionalService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute({
    appointmentId,
    professionalId,
  }: ISetProfessionalDTO): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    if (appointment.professionalId) {
      throw new AppError('Esse agendamento já possui um profissional!');
    }

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    if (!professional) {
      throw new AppError(
        'Profissional não encontrado, verifique e tente novamente!',
      );
    }

    const professionalSpecialties =
      await this.professionalSpecialtiesRepository.findByProfessionalId(
        professionalId,
      );

    let hasRequiredSpecialty: boolean;

    professionalSpecialties.forEach(professionalSpecialty => {
      if (appointment.specialtyId === professionalSpecialty.specialtyId) {
        hasRequiredSpecialty = true;
      }
    });

    if (!hasRequiredSpecialty) {
      throw new AppError(
        'O profissional não possui a especialidade diferente do agendamento!',
      );
    }

    appointment.professionalId = professionalId;

    return this.appointmentsRepository.save(appointment);
  }
}
