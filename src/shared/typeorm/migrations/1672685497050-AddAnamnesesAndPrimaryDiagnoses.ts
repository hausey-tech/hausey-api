import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAnamnesesAndPrimaryDiagnoses1672685497050
  implements MigrationInterface
{
  name = 'AddAnamnesesAndPrimaryDiagnoses1672685497050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "anamneses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying NOT NULL, CONSTRAINT "PK_a5cb24669dd0448b9773732f107" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "primary_diagnoses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "description" character varying NOT NULL, CONSTRAINT "PK_56a82948bc34e35fad9053336c3" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583" FOREIGN KEY ("anamnesis_id") REFERENCES "anamneses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f" FOREIGN KEY ("primary_diagnosis_id") REFERENCES "primary_diagnoses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_a76c9fe694f768b4db9254ab17f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_2fb3867ad063c45fe297e7d9583"`,
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
    await queryRunner.query(`DROP TABLE "primary_diagnoses"`);
    await queryRunner.query(`DROP TABLE "anamneses"`);
  }
}
