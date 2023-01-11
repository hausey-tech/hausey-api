import { Repository } from 'typeorm';

import { PostgresDataSource } from '../../../shared/typeorm';
import { CreateSpecialtyDTO } from '../contracts/dtos/create-specialty';
import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ProfessionalSpecialty } from '../entities/professional-specialty';

export class ProfessionalSpecialtiesRepository
  implements IProfessionalSpecialtiesRepository
{
  private ormRepository: Repository<ProfessionalSpecialty>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(
      ProfessionalSpecialty,
    );
  }

  public async findAll(): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<ProfessionalSpecialty> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByProfessionalTypeId(
    professionalTypeid: string,
  ): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find({
      where: { professionalTypeId: professionalTypeid },
    });
  }

  public async create(
    specialty: CreateSpecialtyDTO,
  ): Promise<ProfessionalSpecialty> {
    return this.ormRepository.create(specialty);
  }

  public async save(
    specialty: ProfessionalSpecialty,
  ): Promise<ProfessionalSpecialty> {
    return this.ormRepository.save(specialty);
  }

  public async findByMemedId(memedId: number): Promise<ProfessionalSpecialty> {
    return this.ormRepository.findOne({ where: { memedId } });
  }
}
