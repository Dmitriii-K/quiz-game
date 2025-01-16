import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../sessions/domain/session.typeorm.entity';
import { DeviceViewModel, mapSession } from '../api/models/output.model';

@Injectable()
export class SessionsQueryRepository {
    constructor(
        @InjectRepository(Session) protected sessionRepository: Repository<Session>,
    ) {}

    async findSessions(userId: string): Promise<DeviceViewModel[] | null> {
        if (!userId) {
            return null; // Возвращаем null, если userId не предоставлен
        }

        const currentTime = new Date().toISOString();

        const sessions = await this.sessionRepository.find({
            where: {
                user_id: userId,
                // exp: MoreThanOrEqual(currentTime), // Если нужно фильтровать по времени
            },
        });

        return sessions.map(mapSession);
    }
}