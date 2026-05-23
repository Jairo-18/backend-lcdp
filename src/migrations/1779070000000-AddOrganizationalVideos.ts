import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrganizationalVideos1779070000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizational" ADD "heroVideos" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational" ADD "aboutVideos" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "aboutVideos"`);
    await queryRunner.query(`ALTER TABLE "organizational" DROP COLUMN "heroVideos"`);
  }
}
