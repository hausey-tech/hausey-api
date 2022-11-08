import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

import Base from '../../../../../shared/infra/typeorm/entities/Base';
import User from '../../../../users/infra/typeorm/entities/User';
import ProfessionalSpecialty from './ProfessionalSpecialty';
import ProfessionalType from './ProfessionalType';

@Entity('professionals')
class Professional extends Base {
  @Column('varchar', { name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar', { name: 'professional_specialty_id' })
  professionalSpecialtyId: string;

  @ManyToOne(() => ProfessionalSpecialty)
  @JoinColumn({ name: 'professional_specialty_id' })
  professionalSpecialty: ProfessionalSpecialty;

  @Column('varchar')
  registration: string;

  @Column('varchar', { name: 'registration_uf' })
  registrationUf: string;

  @Column('varchar', { name: 'professional_type_id' })
  professionalTypeId: string;

  @ManyToOne(() => ProfessionalType)
  @JoinColumn({ name: 'professional_type_id' })
  professionalType: ProfessionalType;
}

export default Professional;
