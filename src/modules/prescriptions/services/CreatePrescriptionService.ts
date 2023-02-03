import { injectable, inject, container } from 'tsyringe';

import { GetMemedPrescriptionPdfUrl } from '../../integrations/services/get-memed-prescription-pdf-url';
import { IPrescriptionsRepository } from '../contracts/repositories/IPrescriptionsRepository';
import { IAppointmentsRepository } from '../../appointments/contracts/repositories/appointments';
import { Prescription } from '../entities/Prescription';
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
    token,
  }: {
    appointmentId: string;
    externalId: number;
    token: string;
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

    const getPrescriptionUrl = container.resolve(GetMemedPrescriptionPdfUrl);

    let pdfUrl: string;

    try {
      pdfUrl = await getPrescriptionUrl.execute({ externalId, token });
    } catch (err) {
      const error = err?.response?.data;
      const statusCode = err?.response?.status;

      throw new AppError(error, statusCode);
    }

    const prescription = await this.prescriptionsRepository.create({
      appointmentId,
      externalId,
      pdfUrl,
    });

    return this.prescriptionsRepository.save(prescription);
  }
}
