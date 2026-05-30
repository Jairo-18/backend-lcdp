import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHowToOrderVideoUrl1779100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" ADD COLUMN IF NOT EXISTS "howToOrderVideoUrl" varchar(500)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN IF EXISTS "howToOrderVideoUrl"`);
  }
}
