import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { Patient } from './patient';

@Entity('patient_files')
export class PatientFiles extends BaseEntity {
  @Column('varchar', { name: 'file_url' })
  fileUrl: string;

  @Column('varchar')
  patientId: string;

  @ManyToOne(() => Patient, patient => patient.files)
  patient: Patient;

  @Column('varchar')
  title: string;
}
