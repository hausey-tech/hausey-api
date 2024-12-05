import { injectable, inject, container } from 'tsyringe';
import { Logger } from 'pino';
import { GetCustomerInfoPagarmeService } from '../../integrations/services/pagarme/customer-info-pagarme-service';
import { ResponsePagarmeSubscription } from '../../integrations/services/dtos/response-pagarme-getSubscriptionByCustomerId.dto';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';

@injectable()
export class GetCustomerInfos {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('Logger')
    private logger: Logger,
  ) {}

  public async execute(
    patientId: string,
  ): Promise<ResponsePagarmeSubscription> {
    this.logger.info(
      {
        patientId,
      },
      'Este é o id do paciente',
    );
    const patient = await this.patientsRepository.findById(patientId);

    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique o id informado e tente novamente!',
      );
    }

    const createPagarmeSubscriptionService = container.resolve(
      GetCustomerInfoPagarmeService,
    );

    this.logger.info(
      {
        patientInfo: patient,
      },
      'Este é um paciente encontrado',
    );

    const patientInfo = createPagarmeSubscriptionService.execute(
      patient.stripeCustomerId,
    );

    return patientInfo;
  }
}
