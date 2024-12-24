import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStartToDate1733971843639 implements MigrationInterface {
  name = 'ChangeStartToDate1733971843639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "start_time"`);
    await queryRunner.query(`ALTER TABLE "slots" ADD "start_time" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "end_time"`);
    await queryRunner.query(`ALTER TABLE "slots" ADD "end_time" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "end_time"`);
    await queryRunner.query(`ALTER TABLE "slots" ADD "end_time" TIME`);
    await queryRunner.query(`ALTER TABLE "slots" DROP COLUMN "start_time"`);
    await queryRunner.query(`ALTER TABLE "slots" ADD "start_time" TIME`);
  }
}
