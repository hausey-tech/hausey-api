import { injectable, inject, container } from 'tsyringe';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { SyncDependentsPlanService } from '../../dependents/services/sync-dependents-plan';

interface Props {
  customerId: string;
  priceId: string;
}

@injectable()
export class DetectAndApplyPlanChangeService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ customerId, priceId }: Props): Promise<void> {
    const patient = await this.patientsRepository.findByCustomerId(customerId);

    if (!patient) {
      return;
    }

    const plan = await this.plansRepository.findyByPriceId(priceId);

    if (!plan) {
      return;
    }

    if (plan.id === patient.planId) {
      return;
    }

    patient.planId = plan.id;
    patient.isPro = plan.isPro;

    const updatedPatient = await this.patientsRepository.save(patient);

    const syncDependentsPlanService = container.resolve(
      SyncDependentsPlanService,
    );
    await syncDependentsPlanService.execute({
      holderId: updatedPatient.id,
      planId: updatedPatient.planId,
      planExpiresAt: updatedPatient.planExpiresAt,
    });
  }
}
