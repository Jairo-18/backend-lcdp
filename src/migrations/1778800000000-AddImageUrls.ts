import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImageUrls1778800000000 implements MigrationInterface {
  name = 'AddImageUrls1778800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brands" ADD "images" jsonb NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "images" jsonb NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "organizational" ADD "bannerImages" jsonb NOT NULL DEFAULT '[]'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "bannerImages"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "images"`);
  }
}
