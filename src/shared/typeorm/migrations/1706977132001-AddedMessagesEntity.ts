import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedMessagesEntity1706977132001 implements MigrationInterface {
  name = 'AddedMessagesEntity1706977132001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" character varying NOT NULL, "to" character varying NOT NULL, "image" character varying, "title" character varying, "body" character varying, "starts_at" TIMESTAMP, "expires_at" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "read_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "message_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_83aacaaeae90ed8f7425a0b24fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "read_messages" ADD CONSTRAINT "FK_2ff63cb5db6c41a60ab41fdba1a" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "read_messages" ADD CONSTRAINT "FK_22d20d5eaca1d979038895e949c" FOREIGN KEY ("user_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "read_messages" DROP CONSTRAINT "FK_22d20d5eaca1d979038895e949c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "read_messages" DROP CONSTRAINT "FK_2ff63cb5db6c41a60ab41fdba1a"`,
    );
    await queryRunner.query(`DROP TABLE "read_messages"`);
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
