import { injectable, inject, container } from 'tsyringe';
import { AppError } from '../../../shared/errors/app-error';
import { CreateProduct } from '../../integrations/services/stripe/create-product';
import { IPlansRepository } from '../contracts/repositories/plans';
import { Plan } from '../entities/plan';

interface Props {
  name: string;
  description: string;
  price: number;
}

@injectable()
export class CreatePlan {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ name, description, price }: Props): Promise<Plan> {
    const planExists = await this.plansRepository.findByName(name);

    if (planExists) {
      throw new AppError('Já existe um plano com esse nome!');
    }

    const createProductService = container.resolve(CreateProduct);

    const { default_price: defaultPrice } = await createProductService.execute({
      name,
      description,
      price,
    });

    const plan = await this.plansRepository.create({
      name,
      description,
      price,
    });

    plan.stripePriceId = defaultPrice.toString();

    return this.plansRepository.save(plan);
  }
}
