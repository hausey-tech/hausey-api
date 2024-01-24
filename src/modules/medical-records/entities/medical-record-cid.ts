import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../shared/typeorm/entities/base';
import { MedicalRecord } from './medical-record';

@Entity('medical_record_cids')
export class MedicalRecordCid extends BaseEntity {
  @Column('varchar')
  cid: string;

  @ManyToOne(() => MedicalRecord, medRec => medRec.cids)
  medicalRecord: MedicalRecord;
}
