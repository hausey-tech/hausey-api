import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsProToPatientTableAndAccessLevelToPlanTable1752180000000
  implements MigrationInterface
{
  name = 'AddIsProToPatientTableAndAccessLevelToPlanTable1752180000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "is_pro" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "access_level" integer NOT NULL DEFAULT 10`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "access_level"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "is_pro"`);
  }
}
