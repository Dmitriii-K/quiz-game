import { Injectable } from "@nestjs/common";
import { DeviceViewModel, mapSession } from "../api/models/output.model";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class SessionsQueryRepository{
    constructor(@InjectDataSource() protected dataSource: DataSource) {}

    async findSessions(userId: string): Promise<DeviceViewModel[] | null> {
        if (!userId) {
            throw new Error("User ID is required");
        }
        const currentTime = new Date().toISOString();

        const query = `
            SELECT * FROM "Sessions"
            WHERE user_id = $1 
            --AND exp >= $2
        `;
        const sessions = await this.dataSource.query(query, [userId/*, currentTime*/]);
        return sessions.map(mapSession);
    }
}