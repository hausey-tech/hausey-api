/* eslint-disable import/no-duplicates */
import { injectable, inject } from 'tsyringe';

import { Logger } from 'pino';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { AppError } from '../../../shared/errors/app-error';
import { Slot } from '../entities/slot';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Professional } from '../../professionals/entities/professional';

interface IFindAvailableSlotsDTO {
  professionalId?: string;
}

interface IAvailability {
  id: string;
  professional: Professional;
  date: Date;
  slots: {
    startTime: Date;
    endTime: Date;
  };
}

@injectable()
export class FindSlotsService {
  constructor(
    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,

    @inject('ProfessionalsRepository')
    private professionalRepository: IProfessionalsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute({
    professionalId,
  }: IFindAvailableSlotsDTO): Promise<IAvailability[]> {
    if (professionalId) {
      const professional = await this.professionalRepository.findById(
        professionalId,
      );

      if (!professional) {
        throw new AppError('Profissional não encontrado');
      }
      const slots = await this.slotsRepository.findByProfessionalId(
        professionalId,
      );

      if (slots.length === 0) {
        throw new AppError(
          'Não há nenhuma data disponível para essa especialidade!',
        );
      }
      const availability: IAvailability[] = [];

      slots.forEach((slot: Slot) => {
        availability.push({
          id: slot.id,
          date: slot.date,
          professional: slot.professional,
          slots: {
            startTime: slot.startTime,
            endTime: slot.endTime,
          },
        });
      });

      return availability;
    }

    const slots = await this.slotsRepository.find();

    if (slots.length === 0) {
      this.logger.info(
        {
          slots,
        },
        'Não há nenhuma escala cadastrada!',
      );
      throw new AppError('Não há nenhuma escala cadastrada!');
    }
    const availability: IAvailability[] = [];

    slots.forEach((slot: Slot) => {
      availability.push({
        id: slot.id,
        date: slot.date,
        professional: slot.professional,
        slots: {
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      });
    });

    return availability;
  }
}
