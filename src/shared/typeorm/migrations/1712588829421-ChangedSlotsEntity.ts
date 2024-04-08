import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedSlotsEntity1712588829421 implements MigrationInterface {
  name = 'ChangedSlotsEntity1712588829421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" ADD "date" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "slots" ALTER COLUMN "week_day" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" ALTER COLUMN "week_day" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "date"`);
  }
}
