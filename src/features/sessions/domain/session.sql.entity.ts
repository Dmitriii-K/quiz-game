import { randomUUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('Sessions')
export class Session {
    @PrimaryColumn('uuid')
    id: string;

    // @Column({ type: 'int', nullable: false })
    // user_id: number;
    @Column({ type: 'varchar', nullable: false })
    user_id: string;

    @Column({ type: 'varchar', nullable: false })
    device_id: string;

    @Column({ type: 'varchar', nullable: false })
    iat: string;

    @Column({ type: 'varchar', nullable: false })
    exp: string;

    @Column({ type: 'varchar', nullable: false })
    device_name: string;

    @Column({ type: 'varchar', nullable: false })
    ip: string;

    static createSession(userId: string, deviceId: string, iat: string, exp: string, userAgent: string, ip: string): Session {
        const session = new Session();
        
        session.id = randomUUID();
        session.user_id = userId;
        session.device_id = deviceId;
        session.iat = iat;
        session.exp = exp;
        session.device_name = userAgent;
        session.ip = ip;
        return session;
    }
}