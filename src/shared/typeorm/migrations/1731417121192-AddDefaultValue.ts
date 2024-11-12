import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultValue implements MigrationInterface {
  name = 'AddDefaultValue1731417121192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" ALTER COLUMN "professionalType" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slots" ALTER COLUMN "professionalType" SET NOT NULL`,
    );
  }
}
