import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import Base from '../../../shared/typeorm/entities/Base';
import Patient from './Patient';
import Program from './Program';

@Entity('patient_programs')
class PatientProgram extends Base {
  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'program_id' })
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program: Program;
}

export default PatientProgram;
