import { injectable, inject, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { CreatePagarmePlanService } from '../../integrations/services/pagarme/create-pagarme-plan-service';
import { IPlansRepository } from '../contracts/repositories/plans';
import { Plan } from '../entities/plan';

interface Props {
  name: string;
  description: string;
  price: number;
  isPro?: boolean;
  type?: 'Individual' | 'Familiar';
}

@injectable()
export class CreatePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    name,
    description,
    price,
    isPro,
    type,
  }: Props): Promise<Plan> {
    const planExists = await this.plansRepository.findByName(name);

    if (planExists) {
      throw new AppError('Já existe um plano com esse nome!');
    }

    const createPagarmePlanService = container.resolve(
      CreatePagarmePlanService,
    );

    const planId = await createPagarmePlanService.execute({
      name,
      description,
      price,
    });

    const plan = await this.plansRepository.create({
      name,
      description,
      price,
      isPro: isPro ?? false,
      type,
    });

    plan.stripePriceId = planId;

    return this.plansRepository.save(plan);
  }
}
