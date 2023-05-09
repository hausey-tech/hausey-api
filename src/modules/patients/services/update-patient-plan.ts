import { injectable, inject } from 'tsyringe';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';

interface Props {
  periodEnd: number;
  priceId: string;
  customerId: string;
}

@injectable()
export class UpdatePatientPlanService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    customerId,
    priceId,
    periodEnd,
  }: Props): Promise<void> {
    const patient = await this.patientsRepository.findByCustomerId(customerId);

    if (!patient) {
      console.error('Paciente não encontrado!');
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      console.error('Plano não encontrado!');
    }

    patient.planId = plan.id;
    patient.planExpiresAt = new Date(periodEnd * 1000);

    await this.patientsRepository.save(patient);
  }
}
