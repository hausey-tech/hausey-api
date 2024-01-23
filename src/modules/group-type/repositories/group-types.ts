import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateGroupTypeDto } from '../contracts/dtos/create-group-type';
import { GroupType } from '../entities/group-type';
import { IGroupTypesRepository } from '../contracts/repositories/group-types';

export class GroupTypesRepository implements IGroupTypesRepository {
  private ormRepository: Repository<GroupType>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(GroupType);
  }

  public async findAll(): Promise<GroupType[]> {
    return this.ormRepository.find();
  }

  public async findByName(name: string): Promise<GroupType | null> {
    return this.ormRepository.findOne({ where: { name } });
  }

  public async findById(id: string): Promise<GroupType | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByRoleId(roleId: string): Promise<GroupType[] | null> {
    return this.ormRepository.find({ where: { roleId } });
  }

  public async create(groupType: ICreateGroupTypeDto): Promise<GroupType> {
    return this.ormRepository.create(groupType);
  }

  public async save(groupType: GroupType): Promise<GroupType> {
    return this.ormRepository.save(groupType);
  }
}
