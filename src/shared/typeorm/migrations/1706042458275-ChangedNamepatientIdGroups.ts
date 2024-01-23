import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedNamepatientIdGroups1706042458275
  implements MigrationInterface
{
  name = 'ChangedNamepatientIdGroups1706042458275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP CONSTRAINT "FK_cd25ff4347d2dd7b7086c52fe95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP COLUMN "patient_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP COLUMN "patient_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD "patient_group_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD CONSTRAINT "FK_462941a546dd5a7f0b3ea0aff73" FOREIGN KEY ("patient_group_id") REFERENCES "patient_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP CONSTRAINT "FK_462941a546dd5a7f0b3ea0aff73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" DROP COLUMN "patient_group_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD "patient_group_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD "patient_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_group_type" ADD CONSTRAINT "FK_cd25ff4347d2dd7b7086c52fe95" FOREIGN KEY ("patient_id") REFERENCES "patient_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
