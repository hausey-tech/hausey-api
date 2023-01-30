import { Repository } from 'typeorm';

import { IProfessionalSpecialtiesRepository } from '../contracts/repositories/professional-specialties';
import { ICreateProfessionalSpecialtyDTO } from '../contracts/dtos/create-professional-specialty';
import { ProfessionalSpecialty } from '../entities/professional-specialty';
import { PostgresDataSource } from '../../../shared/typeorm';

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

  public async findBySpecialtyId(
    specialtyId: string,
  ): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find({ where: { specialtyId } });
  }

  public async findByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalSpecialty[]> {
    return this.ormRepository.find({
      where: { professionalId },
    });
  }

  public async create(
    professionalSpecialty: ICreateProfessionalSpecialtyDTO,
  ): Promise<ProfessionalSpecialty> {
    return this.ormRepository.create(professionalSpecialty);
  }

  public async save(
    professionalSpecialty: ProfessionalSpecialty,
  ): Promise<ProfessionalSpecialty> {
    return this.ormRepository.save(professionalSpecialty);
  }
}
