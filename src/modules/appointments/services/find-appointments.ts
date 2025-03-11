import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import moment from 'moment-timezone';
import { IAddressesRepository } from '../../addresses/contracts/repositories/IAddressesRepository';
import { Appointment } from '../entities/appointment';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import {
  getCountryFromTimezone,
  verifyTimeZone,
} from '../utils/return-timezone';

@injectable()
export class FindAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(
    query: any,
  ): Promise<
    (Appointment & { timeZone?: string | null; hrPatient?: string })[]
  > {
    const { patientId, professionalId, finished, appointmentId } = query;

    const where: FindOptionsWhere<Appointment> = {};

    if (patientId) where.patientId = patientId;
    if (appointmentId) where.id = appointmentId;

    if (professionalId) {
      if (professionalId === 'null') {
        where.professionalId = IsNull();
      } else if (professionalId === '!null') {
        where.professionalId = Not(IsNull());
      } else {
        where.professionalId = professionalId;
      }
    }

    if (typeof finished === 'boolean') {
      where.finished = finished;
    }

    const appointments = await this.appointmentsRepository.find(where);

    const patientsWithTimeZones = await Promise.all(
      appointments.map(async appointment => {
        const address = await this.addressesRepository.findByPatientId(
          appointment.patientId,
        );

        const timeZone = verifyTimeZone(
          address?.country,
          address?.state,
          address?.city,
        );

        const countryDoctor = getCountryFromTimezone(
          appointment.professional.professionalTimezone,
        );

        if (!timeZone) {
          console.log(
            `Fuso não identificado ou dados incompletos. País ${address?.country} - Estado ${address?.state} - Cidade ${address?.city}`,
          );
        }

        const hrPatient = timeZone
          ? moment(appointment.date).tz(timeZone).format('YYYY-MM-DD HH:mm:ss')
          : moment(appointment.date).format('YYYY-MM-DD HH:mm:ss');

        const hrDoctor = moment(appointment.date)
          .tz(appointment.professional.professionalTimezone)
          .format('YYYY-MM-DD HH:mm:ss');
        return {
          ...appointment,
          timeZonePatient: timeZone,
          hrPatient,
          hrDoctor,
          siglaDoctor: countryDoctor,
        };
      }),
    );

    return patientsWithTimeZones;
  }
}
