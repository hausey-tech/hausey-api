import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFcmTokenToPatient1705777269009 implements MigrationInterface {
  name = 'AddFcmTokenToPatient1705777269009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "fcmToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "fcmToken"`);
  }
}
