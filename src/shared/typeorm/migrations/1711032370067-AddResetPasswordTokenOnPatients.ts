import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetPasswordTokenOnPatients1711032370067
  implements MigrationInterface
{
  name = 'AddResetPasswordTokenOnPatients1711032370067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "seller_codes" DROP COLUMN "promotion_code_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "reset_password_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" ADD "reset_password_token_expires_in" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "reset_password_token_expires_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patients" DROP COLUMN "reset_password_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "seller_codes" ADD "promotion_code_id" character varying`,
    );
  }
}
