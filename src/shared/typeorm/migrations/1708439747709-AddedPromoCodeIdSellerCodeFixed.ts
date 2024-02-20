import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPromoCodeIdSellerCodeFixed1708439747709
  implements MigrationInterface
{
  name = 'AddedPromoCodeIdSellerCodeFixed1708439747709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "promo_code_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "promo_code_id"`,
    );
  }
}
