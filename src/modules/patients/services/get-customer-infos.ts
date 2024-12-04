import { injectable, inject, container } from 'tsyringe';
import { GetCustomerInfoPagarmeService } from 'modules/integrations/services/pagarme/customer-info-pagarme-service';
import { ResponsePagarmeSubscription } from 'modules/integrations/services/dtos/response-pagarme-getSubscriptionByCustomerId.dto';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';

@injectable()
export class GetCustomerInfos {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(
    patientId: string,
  ): Promise<ResponsePagarmeSubscription> {
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }

    const createPagarmeSubscriptionService = container.resolve(
      GetCustomerInfoPagarmeService,
    );

    const patientInfo = createPagarmeSubscriptionService.execute(
      patient.stripeCustomerId,
    );

    return patientInfo;
  }
}
