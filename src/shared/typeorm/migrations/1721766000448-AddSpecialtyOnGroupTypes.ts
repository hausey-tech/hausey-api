import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSpecialtyOnGroupTypes1721766000448
  implements MigrationInterface
{
  name = 'AddSpecialtyOnGroupTypes1721766000448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_types" ADD "specialty_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_types" ADD CONSTRAINT "FK_36cd1fe2f443b5924a25b028f8a" FOREIGN KEY ("specialty_id") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "group_types" DROP CONSTRAINT "FK_36cd1fe2f443b5924a25b028f8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_types" DROP COLUMN "specialty_id"`,
    );
  }
}
