// import { SessionsType } from "src/base/types/session.types";
// import { DeviceViewModel } from "./input.model";

// export interface ISessionsService {
//     deleteAllSessionsExceptCurrentOne(userId: string, deviceId: string): Promise<boolean>;
//     deleteSessionById(userId: string): Promise<boolean>;
//     findUserByDeviceId(deviceId: string): Promise<SessionsType | null>;
// }

// export interface ISessionsQueryRepository {
//     findSessions(userId: string): Promise<DeviceViewModel[] | null>;
// }

// export interface ISessionsRepository {
//     deleteAllSessionsExceptCurrentOne(userId: string, device_id: string): Promise<boolean>;
//     deleteSessionById(deviceId: string): Promise<boolean>;
//     findUserByDeviceId(deviceId: string): Promise<SessionsType | null>;
// }

// export const TYPES = {
//     ISessionsRepository: Symbol.for("ISessionsRepository"),
//     ISessionsService: Symbol.for("ISessionsService"),
//     ISessionsQueryRepository: Symbol.for("ISessionsQueryRepository")
// };