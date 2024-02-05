import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities';
import { Team } from './team-entity';
import { Professional } from '../../professionals/entities/professional';

@Entity('team_professionals')
export class TeamProfessional extends BaseEntity {
  @Column('varchar')
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn()
  team: Team;

  @Column('varchar')
  professionalId: string;

  @OneToOne(() => Professional)
  @JoinColumn()
  professional: Professional;

  @Column('boolean', { default: false })
  responsible: boolean;
}
