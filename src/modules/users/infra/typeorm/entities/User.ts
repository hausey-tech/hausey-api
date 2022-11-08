import { Entity, Column } from 'typeorm';

import Base from '../../../../../shared/infra/typeorm/entities/Base';

@Entity('users')
class User extends Base {
  @Column('varchar')
  name: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  password: string;

  @Column('varchar', { nullable: true, unique: true })
  cpf: string;

  @Column('date', { nullable: true })
  birthdate: Date;

  @Column('int', { nullable: true })
  sex: number;

  @Column('varchar', { name: 'phone_number', nullable: true, unique: true })
  phoneNumber: string;

  // @Column('varchar', { name: 'city_id', nullable: true })
  // cityId: string;

  // @Column('varchar', { nullable: true })
  // nationality: string;
}

export default User;
