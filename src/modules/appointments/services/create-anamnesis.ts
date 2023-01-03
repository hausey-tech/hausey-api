import { injectable, inject } from 'tsyringe';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { IAnamnesesRepository } from '../contracts/repositories/anamneses';
import { ICreateAnamnesisDTO } from '../contracts/dtos/create-anamnesis';
import { Anamnesis } from '../entities/anamnesis';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreateAnamnesisService {
  constructor(
    @inject('AnamnesesRepository')
    private anamnesesRepository: IAnamnesesRepository,

    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(payload: ICreateAnamnesisDTO): Promise<Anamnesis> {
    const { appointmentId, description } = payload;

    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    if (appointment.anamnesisId) {
      throw new AppError(
        'Já existe uma anamnese para esse agendamento, edite-a!',
      );
    }

    const anamnesis = await this.anamnesesRepository.save(
      await this.anamnesesRepository.create({
        appointmentId,
        description,
      }),
    );

    appointment.anamnesisId = anamnesis.id;

    this.appointmentsRepository.save(appointment);

    return anamnesis;
  }
}
