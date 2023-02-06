import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAppointmentIdOnAnmneseAndDiagnosis1675204209653
  implements MigrationInterface
{
  name = 'AddAppointmentIdOnAnmneseAndDiagnosis1675204209653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD "appointment_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD CONSTRAINT "UQ_aa16fa45c2c6240aeeffa935003" UNIQUE ("appointment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" ADD "appointment_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" ADD CONSTRAINT "UQ_44d185abef90b5e5ff5b9e8477f" UNIQUE ("appointment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD CONSTRAINT "FK_aa16fa45c2c6240aeeffa935003" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583" FOREIGN KEY ("anamnesis_id") REFERENCES "anamneses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f" FOREIGN KEY ("primary_diagnosis_id") REFERENCES "primary_diagnoses"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" ADD CONSTRAINT "FK_44d185abef90b5e5ff5b9e8477f" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "anamneses" DROP CONSTRAINT "FK_44d185abef90b5e5ff5b9e8477f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP CONSTRAINT "FK_aa16fa45c2c6240aeeffa935003"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" DROP CONSTRAINT "UQ_44d185abef90b5e5ff5b9e8477f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP CONSTRAINT "UQ_aa16fa45c2c6240aeeffa935003"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583" FOREIGN KEY ("anamnesis_id") REFERENCES "anamneses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f" FOREIGN KEY ("primary_diagnosis_id") REFERENCES "primary_diagnoses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
