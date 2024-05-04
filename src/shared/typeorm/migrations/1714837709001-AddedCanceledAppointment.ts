import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCanceledAppointment1714837709001
  implements MigrationInterface
{
  name = 'AddedCanceledAppointment1714837709001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "canceled" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "canceled"`,
    );
  }
}
