import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddPrescriptionsOnAppointment1675309840436
  implements MigrationInterface
{
  name = 'AddPrescriptionsOnAppointment1675309840436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "prescriptions" character varying array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP COLUMN "prescriptions"`,
    );
  }
}
