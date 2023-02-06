import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddFinishedOnAppointment1675695284920
  implements MigrationInterface
{
  name = 'AddFinishedOnAppointment1675695284920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "finished" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "paid" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "paid" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "paid" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ALTER COLUMN "paid" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "finished"`,
    );
  }
}
