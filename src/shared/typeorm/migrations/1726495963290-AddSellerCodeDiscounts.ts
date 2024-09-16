import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCodeDiscounts1726495963290 implements MigrationInterface {
  name = 'AddSellerCodeDiscounts1726495963290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seller_code_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "seller_code_id" uuid NOT NULL, "plan_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_9f15a02e4f195ec0a67d34f501b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" ADD CONSTRAINT "FK_20bf3cd324d0294dd430888e21d" FOREIGN KEY ("seller_code_id") REFERENCES "seller_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" ADD CONSTRAINT "FK_afa80e6e72d9434080af551f7ac" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" DROP CONSTRAINT "FK_afa80e6e72d9434080af551f7ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_discounts" DROP CONSTRAINT "FK_20bf3cd324d0294dd430888e21d"`,
    );
    await queryRunner.query(`DROP TABLE "seller_code_discounts"`);
  }
}
