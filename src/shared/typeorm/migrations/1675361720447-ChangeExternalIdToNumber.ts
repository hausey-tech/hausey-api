import { MigrationInterface, QueryRunner } from 'typeorm';

export default class ChangeExternalIdToNumber1675361720447
  implements MigrationInterface
{
  name = 'ChangeExternalIdToNumber1675361720447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP COLUMN "external_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD "external_id" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prescriptions" DROP COLUMN "external_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prescriptions" ADD "external_id" character varying NOT NULL`,
    );
  }
}
