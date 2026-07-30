import { injectable, inject, container } from 'tsyringe';
import { IPlansRepository } from '../../plans/contracts/repositories/plans';
import { IPatientsRepository } from '../contracts/repositories/patients';
import { SyncDependentsPlanService } from '../../dependents/services/sync-dependents-plan';
import { UpdatePatientIsProService } from './update-patient-is-pro';

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

    await this.patientsRepository.save(patient);

    const updatePatientIsProService = container.resolve(
      UpdatePatientIsProService,
    );
    const updatedPatient = await updatePatientIsProService.execute(patient);

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
