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

  public async execute(query: any): Promise<Appointment[]> {
    const { patientId, professionalId, finished, appointmentId } = query;

    const where: FindOptionsWhere<Appointment> = {};

    if (patientId) {
      where.patientId = patientId;
    }
    if (appointmentId) {
      where.id = appointmentId;
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

    const professional = await this.professionalsRepository.findById(
      professionalId,
    );

    console.log(professional);

    const appointments = await this.appointmentsRepository.find(where);

    const patients = appointments.map(async appointment => {
      const address = await this.addressesRepository.findByPatientId(
        appointment.patientId,
      );
      const timeZoneValidate = verifyTimeZone(
        address.country,
        address.state,
        address.city,
      );

      if (!timeZoneValidate) {
        return `Fuso não identificado, registrar no banco. País ${address.country} - Estado ${address.state} - Cidade ${address.city}`;
      }
      return timeZoneValidate;
    });

    console.log(patients);

    return appointments;
  }
}
