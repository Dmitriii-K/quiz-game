import { Injectable } from "@nestjs/common";
import { Session } from "../domain/session.sql.entity";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class SessionRepository{
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const query = `
            DELETE FROM "Sessions"
            WHERE device_id = $1
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        return !!result[1];
    }

    async deleteAllSessionsExceptCurrentOne(userId: string, deviceId: string): Promise<boolean> {
        const query = `
            DELETE FROM "Sessions"
            WHERE user_id = $1 AND device_id <> $2
        `;
        const result = await this.dataSource.query(query, [userId, deviceId]);
        return result.rowCount > 0;
    }

    async findSessionByMiddleware(deviceId: string): Promise<Session | null> {
        const query = `
            SELECT * FROM "Sessions"
            WHERE device_id = $1
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        return result.length ? result[0] : null;
    }

    async findUserByDeviceId(deviceId: string): Promise<Session | null> {
        const query = `
            SELECT * FROM "Sessions"
            WHERE device_id = $1
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        return result.length ? result[0] : null;
    }

    async createSession(session: Session): Promise<string> {
        const query = `
            INSERT INTO "Sessions" (id, user_id, device_id, iat, exp, device_name, ip)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        const result = await this.dataSource.query(query, [
            session.id,
            session.user_id,
            session.device_id,
            session.iat,
            session.exp,
            session.device_name,
            session.ip,
        ]);
        return result[0].id;
    }

    async findSessionFromDeviceId(deviceId: string): Promise<Session | null> {
        const query = `
            SELECT * FROM "Sessions"
            WHERE device_id = $1
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        return result.length ? result[0] : null;
    }

    async updateIat(iat: string, deviceId: string): Promise<void> {
        const query = `
            UPDATE "Sessions"
            SET iat = $1
            WHERE device_id = $2
        `;
        await this.dataSource.query(query, [iat, deviceId]);
    }

    async deleteSession(deviceId: string): Promise<boolean> {
        const query = `
            DELETE FROM "Sessions"
            WHERE device_id = $1
        `;
        const result = await this.dataSource.query(query, [deviceId]);
        return !!result[1];
    }
}