import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusAppointments1731605255732 implements MigrationInterface {
  name = 'AddStatusAppointments1731605255732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD "status" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "appointments" DROP COLUMN "status"`);
  }
}
