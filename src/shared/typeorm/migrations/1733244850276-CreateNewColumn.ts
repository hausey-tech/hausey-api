import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewColumn1733244850276 implements MigrationInterface {
  name = 'CreateNewColumn1733244850276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "first_payment" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "first_payment"`,
    );
  }
}
