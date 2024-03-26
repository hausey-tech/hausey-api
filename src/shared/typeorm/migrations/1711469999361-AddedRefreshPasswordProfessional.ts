import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRefreshPasswordProfessional1711469999361
  implements MigrationInterface
{
  name = 'AddedRefreshPasswordProfessional1711469999361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "reset_password_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "reset_password_token_expires_in" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "reset_password_token_expires_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "reset_password_token"`,
    );
  }
}
