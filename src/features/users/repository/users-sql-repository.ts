import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { User } from "../domain/user.sql.entity";

@Injectable()
export class UserRepository{
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async insertUser(user: User): Promise<string> {
        const query = `
            INSERT INTO "Users" (id, login, password, email, "createdAt", "confirmationCode", "expirationDate", "isConfirmed")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            user.id,
            user.login,
            user.password,
            user.email,
            user.createdAt,
            user.confirmationCode,
            user.expirationDate,
            user.isConfirmed,
        ]);
        return result[0].id;
    }

    async findUserById(userId: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return result.length ? result[0] : null;
    }

    async findUserByMiddleware(id: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [id]);
        return result.length ? result[0] : null;
    }

    async loginIsExist(login: string): Promise<boolean> {
        const query = `
            SELECT COUNT(*) FROM "Users"
            WHERE login = $1
        `;
        const result = await this.dataSource.query(query, [login]);
        return parseInt(result[0].count, 10) > 0;
    }

    async emailIsExist(email: string): Promise<boolean> {
        const query = `
            SELECT COUNT(*) FROM "Users"
            WHERE email = $1
        `;
        const result = await this.dataSource.query(query, [email]);
        return parseInt(result[0].count, 10) > 0;
    }

    async findUserByLogiOrEmail(data: { login: string, email: string }): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE login = $1 OR email = $2
        `;
        const result = await this.dataSource.query(query, [data.login, data.email]);
        return result.length ? result[0] : null;
    }

    async deleteUser(userId: string): Promise<boolean> {
        // console.log('userId', userId)//---------
        const query = `
            DELETE FROM "Users"
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return !!result[1];
    }

    async updateCode(newCode: string, userId: string): Promise<void> {
        const query = `
            UPDATE "Users"
            SET "confirmationCode" = $1
            WHERE id = $2
        `;
        await this.dataSource.query(query, [newCode, userId]);
    }

    async updatePassword(userId: string, pass: string): Promise<boolean> {
        const query = `
            UPDATE "Users"
            SET password = $1
            WHERE id = $2
        `;
        const result = await this.dataSource.query(query, [pass, userId]);
        console.log(result);//---------------
        return !!result[1];
    }

    async checkUserByRegistration(login: string, email: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE login = $1 OR email = $2
        `;
        const result = await this.dataSource.query(query, [login, email]);
        return result.length ? result[0] : null;
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE login = $1 OR email = $1
        `;
        const result = await this.dataSource.query(query, [loginOrEmail]);
        return result.length ? result[0] : null;
    }

    async createUser(user: User): Promise<string> {
        const query = `
            INSERT INTO "Users" (id, login, password, email, "createdAt", "confirmationCode", "expirationDate", "isConfirmed")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            user.id,
            user.login,
            user.password,
            user.email,
            user.createdAt,
            user.confirmationCode,
            user.expirationDate,
            user.isConfirmed,
        ]);
        return result[0].id;
    }

    async findUserByCode(code: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE "confirmationCode" = $1
        `;
        const result = await this.dataSource.query(query, [code]);
        // console.log('result', result);//-----------------------
        return result.length ? result[0] : null;
    }

    async findUserByEmail(mail: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE email = $1
        `;
        const result = await this.dataSource.query(query, [mail]);
        return result.length ? result[0] : null;
    }

    async findOne(login: string): Promise<User | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE login = $1
        `;
        const result = await this.dataSource.query(query, [login]);
        return result.length ? result[0] : null;
    }

    async updateConfirmation(userId: string): Promise<boolean> {
        const query = `
            UPDATE "Users"
            SET "isConfirmed" = true
            WHERE id = $1
        `;
        const result = await this.dataSource.query(query, [userId]);
        return !!result[1];
    }
}