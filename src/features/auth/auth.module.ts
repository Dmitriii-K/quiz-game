import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersModule } from "../users/users.module";
import { SessionsModule } from "../sessions/sessions.module";
import { AdaptersModule } from "src/infrastructure/adapters/adapters.module";
import { AuthLogoutAndDeleteSessionUseCase } from "./application/use-cases/auth-logout-and-delete-session";
import { ConfirmEmailUseCase } from "./application/use-cases/confirm-email";
import { CreateSessionUseCase } from "./application/use-cases/create-session";
import { NewPasswordUseCase } from "./application/use-cases/new-password";
import { PasswordRecoveryUseCase } from "./application/use-cases/password-recovery";
import { RegisterUserUseCase } from "./application/use-cases/register-user";
import { ResendEmailUseCase } from "./application/use-cases/resend-email";
import { UpdateRefreshTokenUseCase } from "./application/use-cases/update-refresh-token";

@Module({
    imports: [
        CqrsModule, 
        UsersModule, 
        SessionsModule, 
        AdaptersModule
    ],
    controllers: [AuthController],
    providers: [
        RegisterUserUseCase, CreateSessionUseCase, ResendEmailUseCase, 
        UpdateRefreshTokenUseCase, NewPasswordUseCase, PasswordRecoveryUseCase, 
        AuthLogoutAndDeleteSessionUseCase, ConfirmEmailUseCase],
    exports: []
})
export class AuthModule {
}