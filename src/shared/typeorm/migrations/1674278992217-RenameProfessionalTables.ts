import { MigrationInterface, QueryRunner } from 'typeorm';

export default class RenameProfessionalTables1674278992217
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" DROP COLUMN "professional_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" RENAME TO "specialties"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_specialty_discounts" RENAME TO "plan_specialty_discounts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_specialty_discounts" RENAME TO "program_specialty_discounts"`,
    );
    await queryRunner.query(`DROP TABLE "plan_professional_type_discounts"`);
    await queryRunner.query(`DROP TABLE "program_professional_type_discounts"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "program_professional_type_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "program_id" uuid NOT NULL, "professional_type_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_d9c837f07bc0c65164797c6fe90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" ADD CONSTRAINT "FK_b628682cd1c5209b464931e3a96" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" ADD CONSTRAINT "FK_28da863fa3935f3af44e76c4227" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "plan_professional_type_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "professional_type_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_b7a63d16f07dddb322d10d96d13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" ADD CONSTRAINT "FK_6f08693de293dfb3bf4239a64ab" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" ADD CONSTRAINT "FK_0c7c58e5626fb94db6c6b71f395" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_specialty_discounts" RENAME TO "program_professional_specialty_discounts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_specialty_discounts" RENAME TO "plan_professional_specialty_discounts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialties" RENAME TO "professional_specialties"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professional_specialties" ADD CONSTRAINT "FK_ca167861b2915db2ad1afcb2387" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
