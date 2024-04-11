import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSellerPartOnPlans1712870624526 implements MigrationInterface {
  name = 'AddSellerPartOnPlans1712870624526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" ADD "seller_part" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "plans" DROP COLUMN "seller_part"`);
  }
}
