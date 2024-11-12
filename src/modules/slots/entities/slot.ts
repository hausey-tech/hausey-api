import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Professional } from '../../professionals/entities/professional';

@Entity('slots')
export class Slot extends BaseEntity {
  @Column('timestamp')
  date: Date;

  @Column('varchar', { name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;

  @Column('varchar', { name: 'professionalType', default: null })
  professionalType: string;

  @Column('int', { name: 'week_day', nullable: true })
  weekDay: number;

  @Column('time', { name: 'start_time' })
  startTime: string;

  @Column('time', { name: 'end_time' })
  endTime: string;
}
