import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddPaidOnAppointment1673626117817
  implements MigrationInterface
{
  name = 'AddPaidOnAppointment1673626117817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" ADD "paid" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "paid"`);
  }
}
