import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../domain/session.typeorm.entity';

@Injectable()
export class SessionRepository {
    constructor(
        @InjectRepository(Session) private sessionsRepository: Repository<Session>
    ) {}

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await this.sessionsRepository.delete({ device_id: deviceId })
        // console.log('result', result);//--------------------
        return result.raw > 0;
    }

    // async deleteAllSessionsExceptCurrentOne(userId: string, deviceId: string): Promise<boolean> {
    //     const query = `
    //         DELETE FROM "Sessions"
    //         WHERE user_id = $1 AND device_id <> $2
    //     `;
    //     const result = await this.dataSource.query(query, [userId, deviceId]);
    //     return result.rowCount > 0;
    // }
    async deleteAllSessionsExceptCurrentOne(userId: string, deviceId: string): Promise<boolean> {
        const result = await this.sessionsRepository
            .createQueryBuilder()
            .delete()
            .from(Session)
            .where('user_id = :userId', { userId })
            .andWhere('device_id <> :deviceId', { deviceId })
            .execute();
        return result.raw > 0;
    }

    async findSessionByMiddleware(deviceId: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({ where: { device_id: deviceId } })
    }

    async findUserByDeviceId(deviceId: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({ where: { device_id: deviceId } });
    }

    async findSessionFromDeviceId(deviceId: string): Promise<Session | null> {
        return this.sessionsRepository.findOne({ where: { device_id: deviceId } });
    }

    async createSession(session: Session): Promise<string> {
        const result = await this.sessionsRepository.insert(session)
        return result.identifiers[0].id;
    }

    async updateIat(iat: string, deviceId: string): Promise<void> {
        await this.sessionsRepository.update({ device_id: deviceId }, { iat });
    }

    async deleteSession(deviceId: string): Promise<boolean> {
        const result = await this.sessionsRepository.delete({ device_id: deviceId });
        // console.log('result', result);//--------------------
        return result.affected !== undefined && result.affected !== null && result.affected > 0;
    }
}