import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecretaries1677951739506 implements MigrationInterface {
  name = 'AddSecretaries1677951739506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "secretaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying, "name" character varying, "document" character varying, "birthdate" character varying, "phone_number" character varying, "sex" character varying(1), CONSTRAINT "PK_f8d22e3ed9a78f2e1d404fba6ef" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "secretaries"`);
  }
}
