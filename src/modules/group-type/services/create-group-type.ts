import { injectable, inject } from 'tsyringe';
import { IGroupTypesRepository } from '../contracts/repositories/group-types';
import { GroupType } from '../entities/group-type';
import { ICreateGroupTypeDto } from '../contracts/dtos/create-group-type';

@injectable()
export class CreateGroupType {
  constructor(
    @inject('GroupTypesRepository')
    private groupTypesRepository: IGroupTypesRepository,
  ) {}

  public async execute({
    name,
    description,
    roleId,
  }: ICreateGroupTypeDto): Promise<GroupType> {
    // const planExists = await this.groupTypesRepository.f(name);

    // if (planExists) {
    //   throw new AppError('Já existe um plano com esse nome!');
    // }

    const groupType = await this.groupTypesRepository.create({
      name,
      description,
      roleId,
    });

    return this.groupTypesRepository.save(groupType);
  }
}
