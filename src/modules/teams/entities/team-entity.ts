import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities';
import { TeamProfessional } from './team-professional-entity';

@Entity('teams')
export class Team extends BaseEntity {
  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  description: string | null;

  @Column('int')
  patientLimit: number;

  @OneToMany(() => TeamProfessional, professional => professional.team)
  professionals: TeamProfessional[];
}
