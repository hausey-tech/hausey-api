import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1704834369098 implements MigrationInterface {
  name = 'CreateUsers1704834369098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying, "name" character varying, "document" character varying, "birthdate" character varying, "phone_number" character varying, "sex" character varying(1), "role_id" uuid NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "role_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_categories" ADD "role_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD CONSTRAINT "FK_743a2a003d736ef4bfcf4bb9c84" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_categories" ADD CONSTRAINT "FK_4ae3f9e1cacec8203234c5588d5" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_categories" DROP CONSTRAINT "FK_4ae3f9e1cacec8203234c5588d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP CONSTRAINT "FK_743a2a003d736ef4bfcf4bb9c84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "clinical_categories" DROP COLUMN "role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "role_id"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
