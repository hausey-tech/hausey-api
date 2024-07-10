import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRegionAndLanguagePatient1720623618316
  implements MigrationInterface
{
  name = 'AddedRegionAndLanguagePatient1720623618316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "region" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "language" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "language"`);
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "region"`);
  }
}
