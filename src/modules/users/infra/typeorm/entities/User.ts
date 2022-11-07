import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Timestamp,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column('varchar', { name: 'phone_number', nullable: true })
  phoneNumber: string;

  // @Column('varchar', { name: 'city_id', nullable: true })
  // cityId: string;

  // @Column('varchar', { nullable: true })
  // nationality: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Timestamp;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Timestamp;
}

export default User;
