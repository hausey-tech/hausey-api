import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClinicalCategory1704749940089 implements MigrationInterface {
  name = 'CreateClinicalCategory1704749940089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clinical_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_6c33b43887ba9676f6be934b9c7" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clinical_categories"`);
  }
}
