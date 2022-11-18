import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateProgramDiscounts1668801179974
  implements MigrationInterface
{
  name = 'CreateProgramDiscounts1668801179974';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "programs" DROP CONSTRAINT "FK_bbd2aa8fd359122d160d9fb5837"`,
    );
    await queryRunner.query(
      `CREATE TABLE "program_professional_specialty_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "program_id" uuid NOT NULL, "professional_specialty_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_f15bd232f76ca9381b34b85006d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "program_professional_type_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "program_id" uuid NOT NULL, "professional_type_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_d9c837f07bc0c65164797c6fe90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "discount"`);
    await queryRunner.query(
      `ALTER TABLE "programs" DROP COLUMN "professional_specialty_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_specialty_discounts" ADD CONSTRAINT "FK_fc0c338ec9e568dc18fd65a1d0a" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_specialty_discounts" ADD CONSTRAINT "FK_16a870566191dabbe1bb2b969b8" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" ADD CONSTRAINT "FK_b628682cd1c5209b464931e3a96" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" ADD CONSTRAINT "FK_28da863fa3935f3af44e76c4227" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" DROP CONSTRAINT "FK_28da863fa3935f3af44e76c4227"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_type_discounts" DROP CONSTRAINT "FK_b628682cd1c5209b464931e3a96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_specialty_discounts" DROP CONSTRAINT "FK_16a870566191dabbe1bb2b969b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program_professional_specialty_discounts" DROP CONSTRAINT "FK_fc0c338ec9e568dc18fd65a1d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ADD "professional_specialty_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ADD "discount" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "program_professional_type_discounts"`);
    await queryRunner.query(
      `DROP TABLE "program_professional_specialty_discounts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ADD CONSTRAINT "FK_bbd2aa8fd359122d160d9fb5837" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
