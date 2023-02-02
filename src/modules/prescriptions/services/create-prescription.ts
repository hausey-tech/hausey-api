import { injectable, inject } from 'tsyringe';

import { IPrescriptionsRepository } from '../contracts/repositories/prescriptions';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { Prescription } from '../entities/prescription';
import { AppError } from '../../../shared/errors/app-error';

@injectable()
export class CreatePrescriptionService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('PrescriptionsRepository')
    private prescriptionsRepository: IPrescriptionsRepository,
  ) {}

  public async execute({
    appointmentId,
    externalId,
  }: {
    appointmentId: string;
    externalId: string;
  }): Promise<Prescription> {
    const appointment = await this.appointmentsRepository.findById(
      appointmentId,
    );

    if (!appointment) {
      throw new AppError(
        'Agendamento não encontrado, verifique e tente novamente!',
      );
    }

    const prescriptionExists =
      await this.prescriptionsRepository.findByExternalId(externalId);

    if (prescriptionExists) {
      throw new AppError('Já existe uma prescrição com esse id externo!');
    }

    // recupera link pdf

    const prescription = await this.prescriptionsRepository.create({
      appointmentId,
      externalId,
      pdfUrl: 'temp',
    });

    return this.prescriptionsRepository.save(prescription);
  }
}
