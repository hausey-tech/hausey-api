import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLinkToMessage1718281070745 implements MigrationInterface {
  name = 'AddLinkToMessage1718281070745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "link" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "link"`);
  }
}
