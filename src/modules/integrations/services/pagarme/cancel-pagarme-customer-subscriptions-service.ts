import { container, injectable, inject } from 'tsyringe';
import { pagarmeInstance } from '../../utils/pagarme-instance';
import { CreateErrorService } from '../../../errors/service/create-error-service';
import { IPatientsRepository } from '../../../patients/contracts/repositories/patients';
import { DeactivateAllDependentsService } from '../../../dependents/services/deactivate-all-dependents';

interface IProps {
  customerId: string;
}

@injectable()
export class CancelPagarmeCustomerSubscriptionsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({ customerId }: IProps): Promise<void> {
    try {
      const { data } = await pagarmeInstance.get(
        `/subscriptions?customer_id=${customerId}&status=active&size=100`,
      );
      if (data?.data) {
        await Promise.all(
          data.data.map(async subscription => {
            await pagarmeInstance.delete(`/subscriptions/${subscription.id}`, {
              data: {
                cancel_pending_invoices: true,
              },
            });
          }),
        );
      }

      const patient = await this.patientsRepository.findByCustomerId(
        customerId,
      );

      if (patient) {
        await this.patientsRepository.update(patient.id, {
          isPro: false,
          planExpiresAt: null,
        });

        const deactivateAllDependentsService = container.resolve(
          DeactivateAllDependentsService,
        );
        await deactivateAllDependentsService.execute({ holderId: patient.id });
      }
    } catch (error) {
      const createErrorService = container.resolve(CreateErrorService);
      createErrorService.execute({
        statusCode: 500,
        message: `Erro ao cancelar assinatura na pagar.me\nCustomerId:${customerId}`,
      });
    }
  }
}
