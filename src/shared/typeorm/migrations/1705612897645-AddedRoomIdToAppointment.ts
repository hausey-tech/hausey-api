import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRoomIdToAppointment1705612897645
  implements MigrationInterface
{
  name = 'AddedRoomIdToAppointment1705612897645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "roomId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "roomId"`);
  }
}
