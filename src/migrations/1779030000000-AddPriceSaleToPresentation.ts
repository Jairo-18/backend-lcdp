import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceSaleToPresentation1779030000000 implements MigrationInterface {
    name = 'AddPriceSaleToPresentation1779030000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "priceSale" numeric(12,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "priceSale"`);
    }
}
