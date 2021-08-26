import {MigrationInterface, QueryRunner} from "typeorm";

export class usersUpdate1630009836793 implements MigrationInterface {
    name = 'usersUpdate1630009836793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "deletedAt" TIMESTAMP`);
    }

}
