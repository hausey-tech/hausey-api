import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerCode1705948715673 implements MigrationInterface {
  name = 'AddSellerCode1705948715673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "seller_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "seller_id" uuid, "uses" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_14939854c72b06cf77a7b319fd8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD CONSTRAINT "FK_53a08042d9ac7512cbd03843e27" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP CONSTRAINT "FK_53a08042d9ac7512cbd03843e27"`,
    );
    await queryRunner.query(`DROP TABLE "seller_codes"`);
  }
}
