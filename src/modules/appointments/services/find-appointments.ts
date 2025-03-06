import { FindOptionsWhere, IsNull, Not } from 'typeorm';
import { injectable, inject } from 'tsyringe';

import { IAddressesRepository } from '../../addresses/contracts/repositories/IAddressesRepository';
import { IProfessionalsRepository } from '../../professionals/contracts/repositories/professionals';
import { Appointment } from '../entities/appointment';
import { IAppointmentsRepository } from '../contracts/repositories/appointments';
import { verifyTimeZone } from '../utils/return-timezone';

@injectable()
export class FindAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('ProfessionalsRepository')
    private professionalsRepository: IProfessionalsRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute(
    query: any,
  ): Promise<(Appointment & { timeZone?: string | null })[]> {
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

    await this.professionalsRepository.findById(professionalId); // Removi o console.log aqui, mantenha se quiser

    const appointments = await this.appointmentsRepository.find(where);

    const patientsWithTimeZones = await Promise.all(
      appointments.map(async appointment => {
        const address = await this.addressesRepository.findByPatientId(
          appointment.patientId,
        );

        const timeZoneValidate = verifyTimeZone(
          address?.country,
          address?.state,
          address?.city,
        );

        if (!timeZoneValidate) {
          console.log(
            `Fuso não identificado ou dados incompletos. País ${address?.country} - Estado ${address?.state} - Cidade ${address?.city}`,
          );
        }

        return {
          ...appointment,
          timeZone: timeZoneValidate,
        };
      }),
    );

    return patientsWithTimeZones;
  }
}
