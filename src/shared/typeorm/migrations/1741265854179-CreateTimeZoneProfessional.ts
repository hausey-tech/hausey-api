import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimeZoneProfessional1741265854179
  implements MigrationInterface
{
  name = 'CreateTimeZoneProfessional1741265854179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" ADD "professional_timezone" character varying NOT NULL DEFAULT 'America/Sao_Paulo'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professionals" DROP COLUMN "professional_timezone"`,
    );
  }
}
