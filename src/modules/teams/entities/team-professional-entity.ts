import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities';
import { Team } from './team-entity';
import { Professional } from '../../professionals/entities/professional';

@Entity('team_professionals')
export class TeamProfessional extends BaseEntity {
  @ManyToOne(() => Team, team => team.professionals)
  team: Team;

  @OneToOne(() => Professional)
  @JoinColumn()
  professional: Professional;

  @Column('boolean', { default: false })
  responsible: boolean;
}
