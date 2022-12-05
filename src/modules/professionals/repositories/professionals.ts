import { Repository } from 'typeorm';

import { IProfessionalsRepository } from '../contracts/repositories/professionals';
import { ICreateProfessionalDTO } from '../contracts/dtos/create-professional';
import { PostgresDataSource } from '../../../shared/typeorm';
import { Professional } from '../entities/professional';

export class ProfessionalsRepository implements IProfessionalsRepository {
  private ormRepository: Repository<Professional>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Professional);
  }

  public async findById(id: string): Promise<Professional | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByUserId(id: string): Promise<Professional | null> {
    return this.ormRepository.findOne({
      where: { userId: id },
      relations: ['user', 'professionalSpecialty', 'professionalType'],
    });
  }

  public async findBySpecialtyId(id: string): Promise<Professional[]> {
    const professionals = this.ormRepository.find({
      where: { professionalSpecialtyId: id },
    });

    return professionals;
  }

  public async findByTypeId(id: string): Promise<Professional[]> {
    const professionals = this.ormRepository.find({
      where: { professionalTypeId: id },
    });

    return professionals;
  }

  public async create(payload: ICreateProfessionalDTO): Promise<Professional> {
    return this.ormRepository.create(payload);
  }

  public async save(professional: Professional): Promise<Professional> {
    return this.ormRepository.save(professional);
  }
}
