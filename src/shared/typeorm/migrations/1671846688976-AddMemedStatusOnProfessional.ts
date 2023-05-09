import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddMemedStatusOnProfessional1671846688976
  implements MigrationInterface
{
  name = 'AddMemedStatusOnProfessional1671846688976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "memed_status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "memed_status"`,
    );
  }
}
