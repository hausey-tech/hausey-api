import { container, inject, injectable } from 'tsyringe';
import { addMonths } from 'date-fns';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { IPagarmeWebhookDTO } from '../../integrations/contracts/dtos/pagarme/pagarme-webhook-dto';
import { CreateNipomedUserService } from '../../integrations/services/nipomed/create-nipomed-user-service';
import { SyncDependentsPlanService } from '../../dependents/services/sync-dependents-plan';

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
      const createNipomedUserService = container.resolve(
        CreateNipomedUserService,
      );
      const syncDependentsPlanService = container.resolve(
        SyncDependentsPlanService,
      );

      if (charge.payment_method === 'pix') {
        const item = data.items[0];
        const pixExpiresAt = addMonths(
          new Date(charge.paid_at),
          item.quantity,
        ).toISOString();
        await this.patientsRepository.update(patient.id, {
          planId: item.code,
          planExpiresAt: pixExpiresAt,
        });
        createNipomedUserService.execute({
          patient,
          expiresAt: pixExpiresAt,
        });
        await syncDependentsPlanService.execute({
          holderId: patient.id,
          planId: item.code,
          planExpiresAt: pixExpiresAt,
        });
      } else {
        await this.patientsRepository.update(patient.id, {
          planExpiresAt: data.cycle.end_at,
        });
        createNipomedUserService.execute({
          patient,
          expiresAt: data.cycle.end_at,
        });
        await syncDependentsPlanService.execute({
          holderId: patient.id,
          planId: patient.planId,
          planExpiresAt: data.cycle.end_at,
        });
      }
    }
  }
}
