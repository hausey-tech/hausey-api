import { injectable, inject } from 'tsyringe';
import { addMinutes, isBefore, format } from 'date-fns';

import { IAppointmentsRepository, ISlotsRepository } from '../contracts';
import { IProfessionalsRepository } from '../../professionals/contracts';
import { groupArrayByKey } from '../../../shared/utils';
import { Slot } from '../entities';

interface IAvailability {
  weekDay: number;
  slots: string[];
}

@injectable()
export class FindSlotsBySpecialty {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute(id: string): Promise<IAvailability[]> {
    const professionals = await this.professionalsRepository.findBySpecialtyId(
      id,
    );

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
          times.push(format(start, 'HH:mm'));
          start = addMinutes(start, 30);
        }
        return null;
      });

      availability.push({
        weekDay: Number(key),
        slots: [...new Set(times)].sort(),
      });
    });

    return availability;
  }
}
