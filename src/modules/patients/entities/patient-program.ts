import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from './patient';
import { Program } from '../../programs/entities/program';

@Entity('patient_programs')
export class PatientProgram extends BaseEntity {
  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'program_id' })
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: Program;
}
