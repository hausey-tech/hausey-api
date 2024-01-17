import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClinicalResumeUser1705513457230 implements MigrationInterface {
  name = 'AddClinicalResumeUser1705513457230';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "clinical_resume_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "clinical_resume_id"`,
    );
  }
}
