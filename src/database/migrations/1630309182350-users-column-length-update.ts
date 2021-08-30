import {MigrationInterface, QueryRunner} from "typeorm";

export class usersColumnLengthUpdate1630309182350 implements MigrationInterface {
    name = 'usersColumnLengthUpdate1630309182350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "firstName" character varying(128) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "username" character varying(64) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "password" character varying(128) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "password" character varying(60) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "username" character varying(60) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "public"."users" ADD "firstName" character varying(120) NOT NULL`);
    }

}
