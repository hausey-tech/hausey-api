import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionOnUsers1730236507309 implements MigrationInterface {
  name = 'AddRegionOnUsers1730236507309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "region" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "region"`);
  }
}
