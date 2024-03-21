import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTeamResumeNullable1711050353397
  implements MigrationInterface
{
  name = 'AddedTeamResumeNullable1711050353397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ALTER COLUMN "file_url" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ALTER COLUMN "file_url" SET NOT NULL`,
    );
  }
}
