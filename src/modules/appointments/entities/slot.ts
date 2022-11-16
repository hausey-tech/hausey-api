import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities';
import { Professional } from '../../professionals/entities';

@Entity('slots')
export class Slot extends BaseEntity {
  @Column('varchar', { name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional)
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('int', { name: 'week_day' })
  weekDay: number;

  @Column('time', { name: 'start_time' })
  startTime: string;

  @Column('time', { name: 'end_time' })
  endTime: string;
}
