// CODIGO BACKUP, quando for implementar para o paciente

// import { FindOptionsWhere, IsNull, Not } from 'typeorm';
// import { injectable, inject } from 'tsyringe';

// import { IAddressesRepository } from '../../addresses/contracts/repositories/IAddressesRepository';
// import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
// import { Appointment } from '../entities/appointment';
// import { IAppointmentsRepository } from '../contracts/repositories/appointments';
// import { verifyTimeZone } from '../utils/return-timezone';

// @injectable()
// export class FindAppointmentsService {
//   constructor(
//     @inject('AppointmentsRepository')
//     private appointmentsRepository: IAppointmentsRepository,

//     @inject('ProfessionalsRepository')
//     private professionalsRepository: IProfessionalsRepository,

//     @inject('AddressesRepository')
//     private addressesRepository: IAddressesRepository,
//   ) {}

//   public async execute(
//     query: any,
//   ): Promise<(Appointment & { timeZone?: string | null })[]> {
//     const { patientId, professionalId, finished, appointmentId } = query;

//     const where: FindOptionsWhere<Appointment> = {};

//     if (patientId) where.patientId = patientId;
//     if (appointmentId) where.id = appointmentId;

//     if (professionalId) {
//       if (professionalId === 'null') {
//         where.professionalId = IsNull();
//       } else if (professionalId === '!null') {
//         where.professionalId = Not(IsNull());
//       } else {
//         where.professionalId = professionalId;
//       }
//     }

//     if (typeof finished === 'boolean') {
//       where.finished = finished;
//     }

//     const professional = await this.professionalsRepository.findById(
//       professionalId,
//     );

//     const appointments = await this.appointmentsRepository.find(where);

//     const patientsWithTimeZones = await Promise.all(
//       appointments.map(async appointment => {
//         const address = await this.addressesRepository.findByPatientId(
//           appointment.patientId,
//         );

//         const timeZoneValidate = verifyTimeZone(
//           address?.country,
//           address?.state,
//           address?.city,
//         );

//         if (!timeZoneValidate) {
//           console.log(
//             `Fuso não identificado ou dados incompletos. País ${address?.country} - Estado ${address?.state} - Cidade ${address?.city}`,
//           );
//         }

//         return {
//           ...appointment,
//           timeZone: timeZoneValidate,
//         };
//       }),
//     );

//     return patientsWithTimeZones;
//   }
// }

import moment from 'moment-timezone';
import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Appointment } from '../entities/appointment';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';

@injectable()
export class FindAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(
    query: any,
  ): Promise<(Appointment & { convertedDate?: string })[]> {
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

    const appointmentsWithConvertedDates = await Promise.all(
      appointments.map(async appointment => {
        if (!appointment.professionalId) {
          return {
            ...appointment,
            convertedDate: null,
          };
        }

        const professional = await this.professionalsRepository.findById(
          appointment.professionalId,
        );

        const professionalTimeZone = professional?.professionalTimezone;

        if (!professionalTimeZone) {
          console.log(
            `Fuso horário do profissional não encontrado para o profissional ${appointment.professionalId}`,
          );
          return {
            ...appointment,
            convertedDate: null,
          };
        }

        const convertedDate = moment(appointment.date)
          .tz(professionalTimeZone)
          .format('YYYY-MM-DD HH:mm:ss');

        return {
          ...appointment,
          convertedDate,
        };
      }),
    );

    return appointmentsWithConvertedDates;
  }
}
