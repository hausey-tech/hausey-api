import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlanRegions1728570143204 implements MigrationInterface {
  name = 'AddPlanRegions1728570143204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plan_regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_5c7da5b27a7937b3fb29e614a07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_regions" ADD CONSTRAINT "FK_01a2b70829ce4d033d7ea134314" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan_regions" DROP CONSTRAINT "FK_01a2b70829ce4d033d7ea134314"`,
    );
    await queryRunner.query(`DROP TABLE "plan_regions"`);
  }
}
