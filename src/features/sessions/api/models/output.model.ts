import { Session } from "../../domain/session.typeorm.entity";

export class DeviceViewModel {
    ip: string;
    title: string;
    lastActiveDate: string;
    deviceId: string
}

export function mapSession(session: Session): DeviceViewModel {
    return {
        ip: session.ip,
        title: session.device_name,
        lastActiveDate: session.iat,
        deviceId: session.device_id
    };
}