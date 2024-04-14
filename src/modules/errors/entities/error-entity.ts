import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('errors')
export class Error extends BaseEntity {
  @Column('varchar', { nullable: true })
  userId: string | null;

  @Column('int', { nullable: true })
  statusCode: number | null;

  @Column('varchar', { nullable: true })
  message: string | null;
}
