import { injectable, inject, container } from 'tsyringe';
import { CreatePagarmeSubscriptionService } from 'modules/integrations/services/pagarme/create-pagarme-subscription-service';
import { AppError } from '../../../shared/errors/app-error';
import { IPatientsRepository } from '../contracts/repositories/patients';

interface IProps {
  patientId: string;
  planId: string;
  paymentMethod: number;
  cardToken: string;
}

@injectable()
export class CreatePatientSubscriptionService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    patientId,
    planId,
    paymentMethod,
    cardToken,
  }: IProps): Promise<void> {
    const patient = await this.patientsRepository.findById(patientId);
    if (!patient) {
      throw new AppError(
        'Paciente não encontrado, verifique e tente novamente!',
      );
    }
    if (!patient.stripeCustomerId) {
      throw new AppError(
        'Paciente não possui conta de pagamento, entre em contato com o suporte!',
      );
    }
    const createPagarmeSubscriptionService = container.resolve(
      CreatePagarmeSubscriptionService,
    );
    const expiresAt = await createPagarmeSubscriptionService.execute({
      planId,
      paymentMethod,
      cardToken,
      customerId: patient.stripeCustomerId,
    });
    patient.planExpiresAt = new Date(expiresAt);
    await this.patientsRepository.save(patient);
  }
}
