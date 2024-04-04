import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecipientIdOnUsers1712155957338 implements MigrationInterface {
  name = 'AddRecipientIdOnUsers1712155957338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "recipient_id" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "recipient_id"`);
  }
}
