import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePromotionCodeFromSellerCodes1726517550150
  implements MigrationInterface
{
  name = 'RemovePromotionCodeFromSellerCodes1726517550150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "promo_code_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "promo_code_id" character varying`,
    );
  }
}
