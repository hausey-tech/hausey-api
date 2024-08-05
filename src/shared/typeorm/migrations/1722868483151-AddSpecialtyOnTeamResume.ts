import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialtyOnTeamResume1722868483151
  implements MigrationInterface
{
  name = 'AddSpecialtyOnTeamResume1722868483151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ADD "specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" ADD CONSTRAINT "FK_dff62a9076c66d95aa2b5280adb" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_resumes" DROP CONSTRAINT "FK_dff62a9076c66d95aa2b5280adb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_resumes" DROP COLUMN "specialty_id"`,
    );
  }
}
