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

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { ISlotsRepository } from '../contracts/repositories/slots';
import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { Appointment } from '../entities/appointment';
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
export class FindAvailableSlotsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('SlotsRepository')
    private slotsRepository: ISlotsRepository,
  ) {}

  public async execute({
    specialtyId,
    days,
  }: IFindAvailableSlotsDTO): Promise<IAvailableSlots[]> {
    const professionals = [];
    // const professionals = await this.professionalsRepository.findBySpecialtyId(
    //   specialtyId,
    // );

    if (professionals.length === 0) {
      throw new AppError(
        'Não há nenhum profissional dessa especialidade cadastrado!',
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

    return availableSlots;
  }
}
