/* eslint-disable import/no-duplicates */
import { injectable, inject } from 'tsyringe';
import { ptBR } from 'date-fns/locale';
import {
  format,
  addDays,
  parseISO,
  setHours,
  getHours,
  getMinutes,
  addMinutes,
  isBefore,
} from 'date-fns';

import { IProfessionalSpecialtiesRepository } from '../../professionals/contracts/repositories/professional-specialties';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { Appointment } from '../../appointments/entities/appointment';
import { AppError } from '../../../shared/errors/app-error';
import { Slot } from '../entities/slot';

interface IFindAvailableSlotsDTO {
  specialtyId: string;
  days: number;
}

interface IBusyDateSlots {
  date: string;
  slots: string[];
}

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
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,

    @inject('ProfessionalSpecialtiesRepository')
    private professionalSpecialtiesRepository: IProfessionalSpecialtiesRepository,
  ) {}

  public async execute({
    specialtyId,
    days,
  }: IFindAvailableSlotsDTO): Promise<IAvailableSlots[]> {
    const professionalsSpecialty =
      await this.professionalSpecialtiesRepository.findBySpecialtyId(
        specialtyId,
      );

    if (professionalsSpecialty.length === 0) {
      throw new AppError(
        'Não há nenhum profissional dessa especialidade cadastrado!',
      );
    }

    const professionalsIds = [
      ...new Set(professionalsSpecialty.map(p => p.professionalId)),
    ];

    const slots = await this.slotsRepository.findByProfessionalIds(
      professionalsIds,
    );

    if (slots.length === 0) {
      throw new AppError(
        'Não há nenhuma data disponível para essa especialidade!',
      );
    }

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
          const formattedTime = format(start, 'HH:mm');
          times.push(formattedTime);
          start = addMinutes(start, 20);
        }
        return null;
      });

      availability.push({
        weekDay: Number(key),
        slots: times.sort(),
      });
    });

    const requiredDates: Omit<IAvailableSlots, 'slots'>[] = [];
    [...Array(days).keys()].forEach(d =>
      requiredDates.push({
        formattedDate: format(addDays(new Date(), d), "dd/MM',' EEEE", {
          locale: ptBR,
        }),
        date: format(addDays(new Date(), d), 'yyyy-MM-dd'),
      }),
    );

    const appointmentsInRequiredDates: Appointment[] = [];
    await Promise.all(
      requiredDates.map(async t => {
        const appointments =
          await this.appointmentsRepository.findBySpecialtyBetweenDates(
            specialtyId,
            [setHours(parseISO(t.date), 0), setHours(parseISO(t.date), 20)],
          );
        if (appointments.length > 0) {
          appointmentsInRequiredDates.push(...appointments);
        }
      }),
    );

    const busyDates: IBusyDateSlots[] = [];
    appointmentsInRequiredDates.forEach(a => {
      const date = format(a.date, 'yyyy-MM-dd');
      const busySlots = [];
      busySlots.push(
        `${getHours(a.date) <= 9 ? `0${getHours(a.date)}` : getHours(a.date)}:${
          getMinutes(a.date) <= 9
            ? `0${getMinutes(a.date)}`
            : getMinutes(a.date)
        }`,
      );
      busyDates.push({ date, slots: busySlots });
    });

    const groupedBusyDates = groupArrayByKey(busyDates, 'date');
    const formattedBusyDates: IBusyDateSlots[] = [];
    Object.keys(groupedBusyDates).forEach(key => {
      const tests = [];

      groupedBusyDates[key].forEach((g: any) => {
        g.slots.forEach(gs => {
          tests.push(gs);
        });
      });

      formattedBusyDates.push({
        date: key,
        slots: tests.sort(),
      });
    });

    const availableSlots: IAvailableSlots[] = [];
    requiredDates.forEach(t => {
      const slotsTest = [];
      availability.forEach(av => {
        if (Number(format(parseISO(t.date), 'i')) === av.weekDay) {
          slotsTest.push(...av.slots);
          formattedBusyDates.forEach(bd => {
            if (t.date === bd.date) {
              av.slots.forEach(avSlot => {
                bd.slots.forEach((bdSlot, index) => {
                  if (bdSlot === avSlot) {
                    if (slotsTest.indexOf(bdSlot) !== -1) {
                      bd.slots.splice(index, 1);
                      slotsTest.splice(slotsTest.indexOf(bdSlot), 1);
                    }
                  }
                });
              });
            }
          });
        }
      });
      availableSlots.push({ ...t, slots: [...new Set(slotsTest)].sort() });
    });

    const filteredAvailableSlots = availableSlots.filter(
      availableSlot => availableSlot.slots.length > 0,
    );

    if (filteredAvailableSlots.length === 0) {
      throw new AppError(
        'Não há nenhuma data disponível para essa especialidade!',
      );
    }

    return filteredAvailableSlots;
  }
}
