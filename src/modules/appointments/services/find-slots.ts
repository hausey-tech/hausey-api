import { injectable, inject, container } from 'tsyringe';
import { addMinutes, isBefore, format } from 'date-fns';

import { Slot } from '../entities/slot';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Professional } from '../../professionals/entities/professional';
import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { AppError } from '../../../shared/errors/app-error';
import { FindAvailableSlotsService } from './find-available-slots';

interface IAvailability {
  weekDay: number;
  slots: string[];
}

interface IAvailableSlots {
  formattedDate: string;
  date: string;
  slots: string[];
}

@injectable()
export class FindSlotsService {
  constructor(
    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute(
    uuid: string,
    filterBy: string,
    days: number,
  ): Promise<IAvailableSlots[]> {
    let professionals: Professional[];

    if (filterBy === 'type') {
      professionals = await this.professionalsRepository.findByTypeId(uuid);
    } else if (filterBy === 'specialty') {
      professionals = await this.professionalsRepository.findBySpecialtyId(
        uuid,
      );
    }

    if (professionals.length === 0) {
      throw new AppError(
        'Nenhum profissional cadastrado nesse tipo ou especialidade!',
      );
    }

    const professionalsIds = professionals.map(p => p.id);

    const slots = await this.slotsRepository.findByProfessionalId(
      professionalsIds,
    );

    const slotsGroupedByWeekDay = groupArrayByKey(slots, 'weekDay');

    const availability: IAvailability[] = [];

    Object.keys(slotsGroupedByWeekDay).forEach(key => {
      const times = [];

      slotsGroupedByWeekDay[key].map((g: Slot) => {
        let start = new Date(
          `${new Date().toJSON().slice(0, 10)} ${g.startTime}`,
        );
        const end = new Date(
          `${new Date().toJSON().slice(0, 10)} ${g.endTime}`,
        );
        while (isBefore(start, end)) {
          const test = format(start, 'HH:mm');
          times.push(test);
          start = addMinutes(start, 20);
        }
        return null;
      });

      availability.push({
        weekDay: Number(key),
        slots: times.sort(),
      });
    });

    const findAvailableSlotsService = container.resolve(
      FindAvailableSlotsService,
    );

    const availableSlots = await findAvailableSlotsService.execute(
      uuid,
      filterBy,
      days,
      availability,
    );

    return availableSlots;
  }
}
