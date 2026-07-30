import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientDependents1750291203000
  implements MigrationInterface
{
  name = 'CreatePatientDependents1750291203000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "patient_dependents" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "holder_id" uuid NOT NULL,
        "dependent_patient_id" uuid,
        "has_app_access" boolean NOT NULL DEFAULT false,
        "name" character varying,
        "birthdate" character varying,
        "cpf" character varying,
        "email" character varying,
        "invite_token" character varying,
        "invite_expires_at" TIMESTAMP,
        "status" character varying(15) NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_patient_dependents" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pd_holder" FOREIGN KEY ("holder_id")
          REFERENCES "patients"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pd_dependent_patient" FOREIGN KEY ("dependent_patient_id")
          REFERENCES "patients"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_pd_holder" ON "patient_dependents" ("holder_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_pd_patient" ON "patient_dependents" ("dependent_patient_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_pd_token" ON "patient_dependents" ("invite_token") WHERE "invite_token" IS NOT NULL`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_pd_unique_invite"
      ON "patient_dependents" ("holder_id", "email")
      WHERE "deleted_at" IS NULL AND "email" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pd_unique_invite"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pd_token"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pd_patient"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pd_holder"`);
    await queryRunner.query(`DROP TABLE "patient_dependents"`);
  }
}
