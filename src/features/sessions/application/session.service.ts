import { Injectable } from "@nestjs/common";
// import { SessionRepository } from "../repository/session.sql.repository";
import { SessionRepository } from "../repository/session.typeorm.repository";

@Injectable()
export class SessionsService {
    constructor(protected sessionRepository: SessionRepository) {}

    async deleteAllSessionsExceptCurrentOne(userId: string, device_id: string) {
        const result = await this.sessionRepository.deleteAllSessionsExceptCurrentOne(userId, device_id);
        return result;
    }
    async deleteSessionById(deviceId: string) {
        const result = await this.sessionRepository.deleteSessionById(deviceId);
        return result;
    }
    async findUserByDeviceId(deviceId: string) {
        const result = await this.sessionRepository.findUserByDeviceId(deviceId);
        return result
    }
}