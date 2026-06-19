import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { IPatientDependentsRepository } from '../contracts/repositories/patient-dependents';
import { PatientDependent } from '../entities/patient-dependent';

export class PatientDependentsRepository
  implements IPatientDependentsRepository
{
  private ormRepository: Repository<PatientDependent>;

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(PatientDependent);
  }

  public async findById(id: string): Promise<PatientDependent | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: ['holder', 'dependentPatient'],
    });
  }

  public async findByHolderId(holderId: string): Promise<PatientDependent[]> {
    return this.ormRepository.find({
      where: { holderId },
      relations: ['dependentPatient'],
    });
  }

  public async findByDependentPatientId(
    dependentPatientId: string,
  ): Promise<PatientDependent | null> {
    return this.ormRepository.findOne({
      where: { dependentPatientId },
      relations: ['holder'],
    });
  }

  public async findActiveByHolderId(
    holderId: string,
  ): Promise<PatientDependent[]> {
    return this.ormRepository.find({
      where: { holderId, status: 'active' },
      relations: ['dependentPatient'],
    });
  }

  public async findPendingByEmail(email: string): Promise<PatientDependent[]> {
    return this.ormRepository.find({
      where: { email, status: 'pending' },
      relations: ['holder'],
    });
  }

  public async findByInviteToken(
    token: string,
  ): Promise<PatientDependent | null> {
    return this.ormRepository.findOne({
      where: { inviteToken: token },
      relations: ['holder', 'dependentPatient'],
    });
  }

  public async countActiveByHolderId(holderId: string): Promise<number> {
    return this.ormRepository.count({
      where: { holderId, status: 'active' },
    });
  }

  public async create(
    data: Partial<PatientDependent>,
  ): Promise<PatientDependent> {
    const entity = this.ormRepository.create(data);
    return this.ormRepository.save(entity);
  }

  public async save(dependent: PatientDependent): Promise<PatientDependent> {
    return this.ormRepository.save(dependent);
  }

  public async softDelete(id: string): Promise<void> {
    await this.ormRepository.softDelete(id);
  }
}
