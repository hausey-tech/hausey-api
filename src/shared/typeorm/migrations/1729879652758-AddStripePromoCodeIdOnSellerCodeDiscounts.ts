import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStripePromoCodeIdOnSellerCodeDiscounts1729879652758
  implements MigrationInterface
{
  name = 'AddStripePromoCodeIdOnSellerCodeDiscounts1729879652758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" ADD "stripe_promo_code_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" DROP COLUMN "stripe_promo_code_id"`,
    );
  }
}
