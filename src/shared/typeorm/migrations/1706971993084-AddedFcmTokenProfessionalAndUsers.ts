import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFcmTokenProfessionalAndUsers1706971993084
  implements MigrationInterface
{
  name = 'AddedFcmTokenProfessionalAndUsers1706971993084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "fcm_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "fcm_token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fcm_token"`);
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "fcm_token"`,
    );
  }
}
