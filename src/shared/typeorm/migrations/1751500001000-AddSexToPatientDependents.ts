import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSexToPatientDependents1751500001000
  implements MigrationInterface
{
  name = 'AddSexToPatientDependents1751500001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "patient_dependents" ADD COLUMN "sex" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "patient_dependents" DROP COLUMN "sex"
    `);
  }
}
