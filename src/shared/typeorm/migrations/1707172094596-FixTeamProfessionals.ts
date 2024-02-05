import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixTeamProfessionals1707172094596 implements MigrationInterface {
  name = 'FixTeamProfessionals1707172094596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_professionals" DROP CONSTRAINT "FK_f986761056168e4b9e22596f6f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" DROP CONSTRAINT "FK_2fd8562f2b606b2149f9ed17008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ALTER COLUMN "team_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ALTER COLUMN "professional_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ADD CONSTRAINT "FK_f986761056168e4b9e22596f6f9" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ADD CONSTRAINT "FK_2fd8562f2b606b2149f9ed17008" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_professionals" DROP CONSTRAINT "FK_2fd8562f2b606b2149f9ed17008"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" DROP CONSTRAINT "FK_f986761056168e4b9e22596f6f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ALTER COLUMN "professional_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ALTER COLUMN "team_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ADD CONSTRAINT "FK_2fd8562f2b606b2149f9ed17008" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_professionals" ADD CONSTRAINT "FK_f986761056168e4b9e22596f6f9" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
