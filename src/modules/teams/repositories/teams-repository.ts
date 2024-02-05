import { Repository } from 'typeorm';
import { PostgresDataSource } from '../../../shared/typeorm';
import { ITeamsRepository } from '../contracts/repositories/teams-repository';
import { Team } from '../entities/team-entity';
import { ICreateTeamDTO } from '../contracts/dtos/create-team-dto';

export class TeamsRepository implements ITeamsRepository {
  private ormRepository: Repository<Team>;

  private relations: string[];

  constructor() {
    this.ormRepository = PostgresDataSource.getRepository(Team);
    this.relations = ['professionals'];
  }

  public async findAll(): Promise<Team[]> {
    return this.ormRepository.find({ relations: this.relations });
  }

  public async findById(id: string): Promise<Team | null> {
    return this.ormRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  public async findByName(name: string): Promise<Team | null> {
    return this.ormRepository.findOne({
      where: { name },
      relations: this.relations,
    });
  }

  public async create(payload: ICreateTeamDTO): Promise<Team> {
    const team = this.ormRepository.create(payload);
    return this.ormRepository.save(team);
  }

  public async save(team: Team): Promise<Team> {
    return this.ormRepository.save(team);
  }
}
