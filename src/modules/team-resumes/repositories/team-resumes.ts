import { FindOptionsWhere, Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ICreateTeamResumeDto } from '../contracts/dtos/create-team-resume';
import { ITeamResumesRepository } from '../contracts/repositories/team-resumes';
import { TeamResume } from '../entities/team-resume';
import { IUpdateTeamResumeDto } from '../contracts/dtos/update-team-resume';

export class TeamResumesRepository implements ITeamResumesRepository {
  private ormRepository: Repository<TeamResume>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(TeamResume);
    this.relations = ['professional', 'role'];
  }

  public async find(
    where: FindOptionsWhere<TeamResume>,
  ): Promise<TeamResume[]> {
    return this.ormRepository.find({
      where,
      order: { createdAt: 'asc' },
      relations: this.relations,
    });
  }

  public async findByPatientId(
    patientId: string,
  ): Promise<TeamResume[] | null> {
    return this.ormRepository.find({ where: { patientId } });
  }

  public async findById(id: string): Promise<TeamResume | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByProfessionalId(
    professionalId: string,
  ): Promise<TeamResume[] | null> {
    return this.ormRepository.find({ where: { professionalId } });
  }

  public async findByPatientAndRoleId(
    patientId: string,
    roleId: string,
    specialtyId?: string,
  ): Promise<TeamResume | null> {
    return this.ormRepository.findOne({
      where: { patientId, roleId, specialtyId },
    });
  }

  public async create(
    clinicalResume: ICreateTeamResumeDto,
  ): Promise<TeamResume> {
    return this.ormRepository.create(clinicalResume);
  }

  public async update(
    id: string,
    payload: IUpdateTeamResumeDto,
  ): Promise<TeamResume> {
    await this.ormRepository.update(id, payload);
    return this.findById(id);
  }

  public async save(clinicalResume: TeamResume): Promise<TeamResume> {
    return this.ormRepository.save(clinicalResume);
  }
}
