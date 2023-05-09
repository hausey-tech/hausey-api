import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripePriceIdOnPlan1676404238046 implements MigrationInterface {
  name = 'AddStripePriceIdOnPlan1676404238046';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "stripe_price_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" DROP COLUMN "stripe_price_id"`,
    );
  }
}
