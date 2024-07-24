import { injectable, inject } from 'tsyringe';
import { IsNull, Not } from 'typeorm';
import { IGroupTypesRepository } from '../contracts/repositories/group-types';
import { GroupType } from '../entities/group-type';
import { IFindAllGroupTypesDTO } from '../contracts/dtos/find-all-group-types-dto';

@injectable()
export class FindGroupTypes {
  constructor(
    @inject('GroupTypesRepository')
    private groupTypesRepository: IGroupTypesRepository,
  ) {}

  public async execute({
    withSpecialty,
  }: IFindAllGroupTypesDTO): Promise<GroupType[]> {
    const roles = await this.groupTypesRepository.findAll({
      specialtyId: withSpecialty ? Not(IsNull()) : IsNull(),
    });

    return roles;
  }
}
