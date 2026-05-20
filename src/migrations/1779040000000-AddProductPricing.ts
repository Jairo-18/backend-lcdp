import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductPricing1779040000000 implements MigrationInterface {
  name = 'AddProductPricing1779040000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD "markupPercentage" integer`);
    await queryRunner.query(`ALTER TABLE "products" ADD "discountPercentage" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "discountPercentage"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "markupPercentage"`);
  }
}
