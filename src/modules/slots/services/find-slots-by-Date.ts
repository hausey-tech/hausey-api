/* eslint-disable import/no-duplicates */
import { injectable, inject } from 'tsyringe';

import { ISlotsRepository } from '../contracts/repositories/slots';
import { AppError } from '../../../shared/errors/app-error';
import { Slot } from '../entities/slot';
import { Professional } from '../../professionals/entities/professional';

interface IAvailability {
  id: string;
  professional: Professional;
  date: Date;
  profissionalType: string;
  slots: {
    startTime: string;
    endTime: string;
  };
}

@injectable()
export class FindSlotsByDateService {
  constructor(
    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute(): Promise<IAvailability[]> {
    const slots = await this.slotsRepository.findByTodayDate();

    if (slots.length === 0) {
      throw new AppError('Não há nenhuma escala cadastrada!');
    }
    const availability: IAvailability[] = [];

    slots.forEach((slot: Slot) => {
      availability.push({
        id: slot.id,
        date: slot.date,
        professional: slot.professional,
        profissionalType: slot.professionalType,
        slots: {
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      });
    });

    return availability;
  }
}
