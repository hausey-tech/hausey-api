import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCodeSellers1726252481712 implements MigrationInterface {
  name = 'AddSellerCodeSellers1726252481712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seller_code_sellers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "seller_code_id" uuid NOT NULL, "seller_id" uuid NOT NULL, "fee" integer NOT NULL, CONSTRAINT "PK_7723e67af19977f1a6e414077c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_sellers" ADD CONSTRAINT "FK_3ca7c8047c0a5b61e212463483b" FOREIGN KEY ("seller_code_id") REFERENCES "seller_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_sellers" ADD CONSTRAINT "FK_97af089093f68afc702f8e51419" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_code_sellers" DROP CONSTRAINT "FK_97af089093f68afc702f8e51419"`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_code_sellers" DROP CONSTRAINT "FK_3ca7c8047c0a5b61e212463483b"`,
    );
    await queryRunner.query(`DROP TABLE "seller_code_sellers"`);
  }
}
