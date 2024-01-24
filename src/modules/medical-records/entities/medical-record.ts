import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { MedicalRecordCid } from './medical-record-cid';

@Entity('medical_records')
export class MedicalRecord extends BaseEntity {
  @Column('varchar')
  description: string;

  @OneToMany(() => MedicalRecordCid, medRecCid => medRecCid.medicalRecord)
  cids: MedicalRecordCid[];
}
