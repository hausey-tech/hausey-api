import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('anamneses')
export class Anamnesis extends BaseEntity {
  @Column('varchar')
  description: string;
}
