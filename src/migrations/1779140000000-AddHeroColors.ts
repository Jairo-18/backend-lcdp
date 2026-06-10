import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHeroColors1779140000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" ADD "heroColors" jsonb NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "heroColors"`);
  }
}
