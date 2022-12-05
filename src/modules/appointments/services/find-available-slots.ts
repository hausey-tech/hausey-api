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
} from 'date-fns';

import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { groupArrayByKey } from '../../../shared/utils/group-array-by-key';
import { Appointment } from '../entities/appointment';

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
  ) {}

  public async execute(
    uuid: string,
    filterBy: string,
    days: number,
    availability: IAvailability[],
  ): Promise<IAvailableSlots[]> {
    const requiredDates: Omit<IAvailableSlots, 'slots'>[] = [];
    [...Array(days).keys()].forEach(d =>
      requiredDates.push({
        formattedDate: format(addDays(new Date(), d), "dd/MM',' EEEE", {
          locale: ptBR,
        }),
        date: format(addDays(new Date(), d), 'yyyy-MM-dd'),
      }),
    );

    let appointments: Appointment[];
    const appointmentsInRequiredDates: Appointment[] = [];
    await Promise.all(
      requiredDates.map(async t => {
        if (filterBy === 'type') {
          appointments =
            await this.appointmentsRepository.findByTypeBetweenDates(uuid, [
              setHours(parseISO(t.date), 0).toISOString(),
              setHours(parseISO(t.date), 20).toISOString(),
            ]);
        } else if (filterBy === 'specialty') {
          appointments =
            await this.appointmentsRepository.findBySpecialtyBetweenDates(
              uuid,
              [
                setHours(parseISO(t.date), 0).toISOString(),
                setHours(parseISO(t.date), 20).toISOString(),
              ],
            );
        }
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
