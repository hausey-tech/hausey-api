import { MigrationInterface, QueryRunner } from 'typeorm';

export default class DropProfessionalTypes1674279578257
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_cdf08e9505cf9c9f24534e247f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_e3fe038a7d439db7aad66a86d44"`,
    );
    await queryRunner.query(`DROP TABLE "professional_types"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "professional_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_e3d58588a20dd763e47e7fd3efe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_e3fe038a7d439db7aad66a86d44" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_types" ADD "description" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_types" ADD "price" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_cdf08e9505cf9c9f24534e247f1" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
