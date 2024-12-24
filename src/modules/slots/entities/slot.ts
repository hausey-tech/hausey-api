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

  @Column('varchar', { name: 'professional_type', default: null, length: 30 })
  professionalType: string;

  @Column('int', { name: 'week_day', nullable: true })
  weekDay: number;

  @Column('timestamp', { name: 'start_time' })
  startTime: Date;

  @Column('timestamp', { name: 'end_time' })
  endTime: Date;
}
