import {MigrationInterface, QueryRunner} from "typeorm";

export class usersUpdate1630009782141 implements MigrationInterface {
    name = 'usersUpdate1630009782141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "deletedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
    }

}
