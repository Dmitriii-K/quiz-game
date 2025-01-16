// import { UserDocument } from "src/features/users/domain/user.entity";
// import { NewPasswordRecoveryInputModel } from "./input.model";
// import { UserInputModel } from "src/features/users/api/models/input.models";
// import { SessionsType } from "src/base/types/session.types";
// import { UnionPayload } from "src/infrastructure/adapters/jwt.service";

// export interface IAuthService {
//     checkCredentials(loginOrEmail: string): Promise<UserDocument | null>;
//     createSession(userId: string, refreshToken: string, userAgent: string, ip: string): Promise<any>;
//     passwordRecovery(email: string): Promise<boolean>;
//     newPassword(data: NewPasswordRecoveryInputModel): Promise<boolean>;
//     updateRefreshToken(user: UserDocument, deviceId: string): Promise<{ accessToken: string, refreshToken: string }>;
//     registerUser(user: UserInputModel): Promise<UserDocument | undefined>;
//     confirmEmail(code: string): Promise<boolean>;
//     resendEmail(email: string): Promise<boolean>;
//     authLogoutAndDeleteSession(deviceId: string): Promise<boolean>;
// }

// export interface IAuthRepository {
//     findSessionFromDeviceId(deviceId: string): Promise<SessionsType | null>;
//     findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null>;
//     checkUserByRegistration(login: string, email: string): Promise<UserDocument | null>;
//     createUser(user: UserDocument): Promise<string>;
//     findUserByCode(code: string): Promise<UserDocument | null>;
//     updateConfirmation(userId: string): Promise<boolean>;
//     findUserByEmail(email: string): Promise<UserDocument | null>;
//     updateCode(userId: string, code: string): Promise<boolean>;
//     createSession(session: SessionsType): Promise<string>;
//     deleteSession(deviceId: string): Promise<boolean>;
//     updatePassword(userId: string, password: string): Promise<boolean>;
//     updateIat(iat: string, deviceId: string): Promise<void>;
// }

// export interface IBcryptService {
//     comparePasswords(password: string, hash: string): Promise<boolean>;
//     createHashPassword(password: string): Promise<string>;
// }

// export interface IEmailService {
//     sendMail(email: string, confirmationCode: string): Promise<void>;
//     sendPasswordRecoveryMail(email: string, recoveryCode: string): Promise<void>;
// }

// export interface IJwtService {
//     generateToken(user: UserDocument, deviceId?: string): { accessToken: string, refreshToken: string };
//     getUserIdByToken(token: string): UnionPayload | null;
// }

// export const TYPES = {
//     IAuthService: Symbol.for("IAuthService"),
//     IAuthRepository: Symbol.for("IAuthRepository"),
//     IBcryptService: Symbol.for("IBcryptService"),
//     IEmailService: Symbol.for("IEmailService"),
//     IJwtService: Symbol.for("IJwtService")
// };