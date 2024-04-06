import { inject, injectable } from 'tsyringe';
import { addMonths } from 'date-fns';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPagarmeWebhookDTO } from '../../integrations/contracts/dtos/pagarme/pagarme-webhook-dto';

@injectable()
export class UpdateSubscriptionByWebhookService {
  constructor(
    @inject('PatientsRepository')
    private readonly patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ data }: IPagarmeWebhookDTO): Promise<void> {
    const charge = data.charges[0];
    if (charge.status === 'paid') {
      const customerId = data.customer.id;
      const patient = await this.patientsRepository.findByCustomerId(
        customerId,
      );
      if (!patient) {
        throw new AppError(
          'Paciente não encontrado, verifique e tente novamente!',
        );
      }
      if (charge.payment_method === 'pix') {
        patient.planExpiresAt = addMonths(new Date(charge.paid_at), 1);
        patient.planId = data.items[0].code;
      } else {
        patient.planExpiresAt = new Date(data.cycle.end_at);
      }
      await this.patientsRepository.save(patient);
    }
  }
}
