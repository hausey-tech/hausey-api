import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Message } from './message-entity';
import { Patient } from '../../patients/entities/patient';

@Entity('read_messages')
export class ReadMessage extends BaseEntity {
  @Column('varchar')
  messageId: string;

  @ManyToOne(() => Message)
  @JoinColumn()
  message: Message;

  @Column('varchar')
  userId: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  user: Patient | null;
}
