import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('messages')
export class Message extends BaseEntity {
  @Column('varchar')
  type: string;

  @Column('varchar')
  to: string;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('varchar', { nullable: true })
  title: string;

  @Column('varchar', { nullable: true })
  body: string;

  @Column('varchar', { nullable: true })
  link: string;

  @Column('timestamp', { nullable: true })
  startsAt: Date;

  @Column('timestamp', { nullable: true })
  expiresAt: Date;
}
