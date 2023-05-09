import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreatePlanDiscounts1668802351706
  implements MigrationInterface
{
  name = 'CreatePlanDiscounts1668802351706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plan_professional_specialty_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "professional_specialty_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_7860c2a4a1df3e424e13f27b2ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "plan_professional_type_discounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "plan_id" uuid NOT NULL, "professional_type_id" uuid NOT NULL, "discount" integer NOT NULL, CONSTRAINT "PK_b7a63d16f07dddb322d10d96d13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "discount"`);
    await queryRunner.query(
      `ALTER TABLE "plan_professional_specialty_discounts" ADD CONSTRAINT "FK_a5124c76ff01c22926ccf3bebd5" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_specialty_discounts" ADD CONSTRAINT "FK_79d6424464b7c3584c010540697" FOREIGN KEY ("professional_specialty_id") REFERENCES "professional_specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" ADD CONSTRAINT "FK_6f08693de293dfb3bf4239a64ab" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" ADD CONSTRAINT "FK_0c7c58e5626fb94db6c6b71f395" FOREIGN KEY ("professional_type_id") REFERENCES "professional_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" DROP CONSTRAINT "FK_0c7c58e5626fb94db6c6b71f395"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_type_discounts" DROP CONSTRAINT "FK_6f08693de293dfb3bf4239a64ab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_specialty_discounts" DROP CONSTRAINT "FK_79d6424464b7c3584c010540697"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plan_professional_specialty_discounts" DROP CONSTRAINT "FK_a5124c76ff01c22926ccf3bebd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "plans" ADD "discount" integer NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "plan_professional_type_discounts"`);
    await queryRunner.query(
      `DROP TABLE "plan_professional_specialty_discounts"`,
    );
  }
}
