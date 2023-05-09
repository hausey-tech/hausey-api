import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropAnamneseAndDiagnosis1675286852816
  implements MigrationInterface
{
  name = 'DropAnamneseAndDiagnosis1675286852816';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "anamneses" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "UQ_a76c9fe694f768b4db9254ab17f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "primary_diagnosis_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "UQ_2fb3867ad063c45fe297e7d9583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "anamnesis_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP CONSTRAINT "UQ_aa16fa45c2c6240aeeffa935003"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP COLUMN "appointment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "anamnesis" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "primary_diagnosis" character varying`,
    );
    await queryRunner.query(`DROP TABLE "anamneses"`);
    await queryRunner.query(`DROP TABLE "primary_diagnoses"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "primary_diagnoses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_56a82948bc34e35fad9053336c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "anamneses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a5cb24669dd0448b9773732f107" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "primary_diagnosis"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "anamnesis"`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD "description" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD "appointment_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "primary_diagnoses" ADD CONSTRAINT "UQ_aa16fa45c2c6240aeeffa935003" UNIQUE ("appointment_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "anamnesis_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "UQ_2fb3867ad063c45fe297e7d9583" UNIQUE ("anamnesis_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "primary_diagnosis_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "UQ_a76c9fe694f768b4db9254ab17f" UNIQUE ("primary_diagnosis_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "anamneses" ADD "description" character varying NOT NULL`,
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
}
