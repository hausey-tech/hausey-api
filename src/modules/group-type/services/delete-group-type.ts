import { injectable, inject } from 'tsyringe';
import { IGroupTypesRepository } from '../contracts/repositories/group-types';
import { GroupType } from '../entities/group-type';
import { AppError } from '../../../shared/errors/app-error';

type Props = {
  groupTypeId: string;
};
@injectable()
export class DeleteGroupType {
  constructor(
    @inject('GroupTypesRepository')
    private groupTypesRepository: IGroupTypesRepository,
  ) {}

  public async execute({ groupTypeId }: Props): Promise<GroupType> {
    // const planExists = await this.groupTypesRepository.f(name);
    const groupExists = await this.groupTypesRepository.findById(groupTypeId);

    if (!groupExists) {
      throw new AppError('Grupo não encontrado. Tente novamente1');
    }

    return this.groupTypesRepository.delete(groupTypeId);
  }
}
