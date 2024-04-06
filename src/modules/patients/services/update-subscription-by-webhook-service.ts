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
    const charge = data.charges ? data.charges[0] : data.charge;
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
        await this.patientsRepository.update(patient.id, {
          planId: data.items[0].code,
          planExpiresAt: addMonths(new Date(charge.paid_at), 1).toISOString(),
        });
      } else {
        await this.patientsRepository.update(patient.id, {
          planExpiresAt: data.cycle.end_at,
        });
      }
    }
  }
}
