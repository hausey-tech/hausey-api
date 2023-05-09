import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddPatientPrimaryDiagnosis1672202451896
  implements MigrationInterface
{
  name = 'AddPatientPrimaryDiagnosis1672202451896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "patient_primary_diagnoses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "patient_id" uuid NOT NULL, "appointment_id" uuid NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_0975b21cd83f3b661d083e7eb94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_primary_diagnoses" ADD CONSTRAINT "FK_9c4d9a81a8c3742c7de4a44d6a6" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_primary_diagnoses" ADD CONSTRAINT "FK_47918f235f2fd0b8102f42c53e8" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_primary_diagnoses" DROP CONSTRAINT "FK_47918f235f2fd0b8102f42c53e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_primary_diagnoses" DROP CONSTRAINT "FK_9c4d9a81a8c3742c7de4a44d6a6"`,
    );
    await queryRunner.query(`DROP TABLE "patient_primary_diagnoses"`);
  }
}
