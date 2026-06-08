import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRendimientoToPresentation1779120000000 implements MigrationInterface {
    name = 'AddRendimientoToPresentation1779120000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_presentations" ADD "rendimiento" numeric(8,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_presentations" DROP COLUMN "rendimiento"`);
    }
}
