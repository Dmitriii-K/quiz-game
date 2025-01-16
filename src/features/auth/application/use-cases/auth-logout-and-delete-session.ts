import { CommandHandler } from "@nestjs/cqrs";
// import { SessionRepository } from "src/features/sessions/repository/session.sql.repository";
import { SessionRepository } from "src/features/sessions/repository/session.typeorm.repository";

export class AuthLogoutAndDeleteSessionCommand {
    constructor(public deviceId: string ) {}
}

@CommandHandler(AuthLogoutAndDeleteSessionCommand)
export class AuthLogoutAndDeleteSessionUseCase {
    constructor(private sessionRepository: SessionRepository) {}

    async execute(command: AuthLogoutAndDeleteSessionCommand) {
        const {deviceId} = command;
        const deletedSession = await this.sessionRepository.deleteSession(deviceId);
        // console.log('deletedSession', deletedSession);//--------------------
        if (deletedSession) {
            return true;
        } else {
            return false;
        }
    }
}