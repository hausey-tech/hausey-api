import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnStatus implements MigrationInterface {
  name = '%name%1731346595992';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" DROP COLUMN "stripe_promo_code_id"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "region"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "region" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" ADD "stripe_promo_code_id" character varying`,
    );
  }
}
