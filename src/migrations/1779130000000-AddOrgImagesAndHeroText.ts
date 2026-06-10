import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrgImagesAndHeroText1779130000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" ADD "heroImages"  jsonb NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "organizational" ADD "aboutImages" jsonb NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`ALTER TABLE "organizational" ADD "heroLine1"   character varying(200)`);
    await queryRunner.query(`ALTER TABLE "organizational" ADD "heroLine2"   character varying(200)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "heroLine2"`);
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "heroLine1"`);
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "aboutImages"`);
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "heroImages"`);
  }
}
