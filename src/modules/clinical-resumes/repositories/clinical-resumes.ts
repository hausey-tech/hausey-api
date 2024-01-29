import { FindOptionsWhere, Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateClinicalResumeDto } from '../contracts/dtos/create-clinical-resume';
import { IClinicalResumesRepository } from '../contracts/repositories/clinical-resumes';
import { ClinicalResume } from '../entities/clinical-resume';

export class ClinicalResumesRepository implements IClinicalResumesRepository {
  private ormRepository: Repository<ClinicalResume>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(ClinicalResume);
    this.relations = ['professional', 'category'];
  }

  public async find(
    where: FindOptionsWhere<ClinicalResume>,
  ): Promise<ClinicalResume[]> {
    return this.ormRepository.find({
      where,
      order: { createdAt: 'asc' },
      relations: this.relations,
    });
  }

  public async findByPatientId(
    patientId: string,
  ): Promise<ClinicalResume | null> {
    return this.ormRepository.findOne({ where: { patientId } });
  }

  public async findById(id: string): Promise<ClinicalResume | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByProfessionalId(
    professionalId: string,
  ): Promise<ClinicalResume[] | null> {
    return this.ormRepository.find({ where: { professionalId } });
  }

  public async create(
    clinicalResume: ICreateClinicalResumeDto,
  ): Promise<ClinicalResume> {
    return this.ormRepository.create(clinicalResume);
  }

  public async save(clinicalResume: ClinicalResume): Promise<ClinicalResume> {
    return this.ormRepository.save(clinicalResume);
  }
}
