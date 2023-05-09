import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddNullableOnEntities1670076120061
  implements MigrationInterface
{
  name = 'AddNullableOnEntities1670076120061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plans" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ALTER COLUMN "plan_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ALTER COLUMN "description" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP CONSTRAINT "FK_8a072c34140bcb19bd70da165e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ALTER COLUMN "description" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ALTER COLUMN "plan_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD CONSTRAINT "FK_8a072c34140bcb19bd70da165e5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ALTER COLUMN "description" SET NOT NULL`,
    );
  }
}
