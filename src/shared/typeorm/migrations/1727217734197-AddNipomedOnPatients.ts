import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNipomedOnPatients1727217734197 implements MigrationInterface {
  name = 'AddNipomedOnPatients1727217734197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "nipomed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "nipomed"`);
  }
}
