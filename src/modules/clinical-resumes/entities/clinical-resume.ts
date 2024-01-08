import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Patient } from 'modules/patients/entities/patient';
import { ClinicalCategory } from 'modules/clinical-categories/entities/clinical-category';
import { Professional } from 'modules/professionals/entities/professional';
import { BaseEntity } from '../../../shared/typeorm/entities/base';

@Entity('clinical_resumes')
export class ClinicalResume extends BaseEntity {
  @Column('varchar', { name: 'clinical_resume' })
  clinicalResume: string;

  @Column('varchar', { name: 'terapeutic_plan' })
  terapeuticPlan: string;

  @Column('varchar', { name: 'patient_id' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column('varchar', { name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => ClinicalCategory, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ClinicalCategory;

  @Column('varchar', { name: 'professional_id' })
  professionalId: string;

  @ManyToOne(() => Professional, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'professional_id' })
  professional: Professional;
}
