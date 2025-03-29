import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import moment from 'moment-timezone';
import { AppError } from '../../../shared/errors/app-error';
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

  public async execute(query: any): Promise<{
    data: (Appointment & {
      timeZonePatient?: string | null;
      hrPatient: string;
      hrDoctor: string;
      flagDoctor?: string;
    })[];
    total: number;
    totalPages: number;
  }> {
    const {
      patientId,
      professionalId,
      finished,
      appointmentId,
      page,
      perPage,
      status,
      emergency,
      date,
      country,
    } = query;

    const where: FindOptionsWhere<Appointment> = {};

    if (patientId) where.patientId = patientId;
    if (appointmentId) where.id = appointmentId;

    if (status) {
      where.status = status;
    }
    if (emergency) {
      where.emergency = emergency;
    }

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

    try {
      const hasPage = page ? Number(page) : 1;
      const hasPerPage = perPage ? Number(perPage) : 10;
      let allAppointments;

      if (date) {
        allAppointments = await this.appointmentsRepository.findByDate(
          date,
          professionalId,
          status,
          country,
          hasPage,
          hasPerPage,
        );
      } else {
        allAppointments = await this.appointmentsRepository.find(
          where,
          hasPage,
          hasPerPage,
        );
      }
      const { data, total, totalPages } = allAppointments;

      const patientsWithTimeZones = await Promise.all(
        data.map(async appointment => {
          const address = await this.addressesRepository.findByPatientId(
            appointment.patientId,
          );

          const timeZone = address
            ? verifyTimeZone(address.country, address.state, address.city)
            : null;

          const countryDoctor = getCountryFromTimezone(
            appointment.professional?.professionalTimezone,
          );

          const hrPatient = timeZone
            ? moment(appointment.date)
                .tz(timeZone)
                .format('YYYY-MM-DD HH:mm:ss')
            : moment(appointment.date)
                .tz('America/Sao_Paulo')
                .format('YYYY-MM-DD HH:mm:ss');

          const hrDoctor = appointment.professional?.professionalTimezone
            ? moment(appointment.date)
                .tz(appointment.professional.professionalTimezone)
                .format('YYYY-MM-DD HH:mm:ss')
            : moment(appointment.date)
                .tz('America/Sao_Paulo')
                .format('YYYY-MM-DD HH:mm:ss');

          return {
            ...appointment,
            timeZonePatient: timeZone,
            hrPatient,
            hrDoctor,
            flagDoctor: countryDoctor,
          };
        }),
      );

      let patientsWithCountryOrDate;

      if (country) {
        console.log(patientsWithTimeZones[0].patient);
        console.log('patientWith0', patientsWithTimeZones[0]);
        patientsWithCountryOrDate = patientsWithTimeZones.filter(
          patient => patient.patient?.address?.country === country,
        );
        return {
          data: patientsWithCountryOrDate,
          total,
          totalPages,
        };
      }

      return {
        data: patientsWithTimeZones,
        total,
        totalPages,
      };
    } catch (error) {
      console.log('Erro no findAppointments', error);
      throw new AppError(error);
    }
  }
}
