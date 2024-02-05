import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamProfessionals1707166035505 implements MigrationInterface {
  name = 'AddTeamProfessionals1707166035505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "team_professionals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "responsible" boolean NOT NULL DEFAULT false, "team_id" uuid, "professional_id" uuid, CONSTRAINT "REL_2fd8562f2b606b2149f9ed1700" UNIQUE ("professional_id"), CONSTRAINT "PK_8c29bc39f038730e559ee5d0236" PRIMARY KEY ("id"))`,
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
    await queryRunner.query(`DROP TABLE "team_professionals"`);
  }
}
