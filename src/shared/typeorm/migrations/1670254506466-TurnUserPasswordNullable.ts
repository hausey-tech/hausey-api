import { MigrationInterface, QueryRunner } from 'typeorm';

export default class TurnUserPasswordNullable1670254506466
  implements MigrationInterface
{
  name = 'TurnUserPasswordNullable1670254506466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`,
    );
  }
}
