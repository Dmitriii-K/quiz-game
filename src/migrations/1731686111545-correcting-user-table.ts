import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectingUserTable1731686111545 implements MigrationInterface {
    name = 'CorrectingUserTable1731686111545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Sessions" DROP CONSTRAINT "FK_28c544a997944cf3bb6f09e9d5e"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "CommentsLikes" DROP CONSTRAINT "FK_41dc91cf58a79ec5f19c5c15e32"`);
        await queryRunner.query(`ALTER TABLE "PostsLikes" DROP CONSTRAINT "FK_e317dfc5787bc03ef88595afec1"`);
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(255) COLLATE "C" NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "confirmationCode" character varying NOT NULL DEFAULT '', "expirationDate" character varying NOT NULL DEFAULT '', "isConfirmed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Sessions" ADD CONSTRAINT "FK_28c544a997944cf3bb6f09e9d5e" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentsLikes" ADD CONSTRAINT "FK_41dc91cf58a79ec5f19c5c15e32" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PostsLikes" ADD CONSTRAINT "FK_e317dfc5787bc03ef88595afec1" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostsLikes" DROP CONSTRAINT "FK_e317dfc5787bc03ef88595afec1"`);
        await queryRunner.query(`ALTER TABLE "CommentsLikes" DROP CONSTRAINT "FK_41dc91cf58a79ec5f19c5c15e32"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`);
        await queryRunner.query(`ALTER TABLE "Sessions" DROP CONSTRAINT "FK_28c544a997944cf3bb6f09e9d5e"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`ALTER TABLE "PostsLikes" ADD CONSTRAINT "FK_e317dfc5787bc03ef88595afec1" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentsLikes" ADD CONSTRAINT "FK_41dc91cf58a79ec5f19c5c15e32" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Sessions" ADD CONSTRAINT "FK_28c544a997944cf3bb6f09e9d5e" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
