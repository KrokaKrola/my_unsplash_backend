import {MigrationInterface, QueryRunner} from "typeorm";

export class usersEmailConfirmed1630309099979 implements MigrationInterface {
    name = 'usersEmailConfirmed1630309099979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "emailConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "emailConfirmed"`);
    }

}
