import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTable1731610321161 implements MigrationInterface {
  name = 'RenameTable1731610321161';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" RENAME COLUMN "professionalType" TO "professional_type"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" RENAME COLUMN "professional_type" TO "professionalType"`,
    );
  }
}
