import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErrors1713110083033 implements MigrationInterface {
  name = 'AddErrors1713110083033';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "errors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" character varying, "status_code" integer, "message" character varying, CONSTRAINT "PK_f1ab2df89a11cd21f48ff90febb" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "errors"`);
  }
}
