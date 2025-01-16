import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from "src/infrastructure/adapters/jwt.pasport-service";
import { NewPasswordRecoveryInputModel, RegistrationConfirmationCodeModel, RegistrationEmailResending } from "./models/input.model";
import { UserInputModel } from "src/features/users/api/models/input.models";
import { Request, Response } from "express";
import { MeViewModel } from "./models/output.model";
import { LocalAuthGuard } from "src/infrastructure/guards/local-auth.guard";
import { JwtAuthGuard } from "src/infrastructure/guards/jwt-auth.guard";
import { SkipThrottle, ThrottlerGuard } from "@nestjs/throttler";
import { BearerAuthGuard } from "src/infrastructure/guards/dubl-guards/bearer-auth.guard";
import { CheckTokenAuthGuard } from "src/infrastructure/guards/dubl-guards/check-refresh-token.guard";
import { RegisterUserCommand } from "../application/use-cases/register-user";
import { CommandBus } from "@nestjs/cqrs";
import { CreateSessionCommand } from "../application/use-cases/create-session";
import { NewPasswordCommand } from "../application/use-cases/new-password";
import { UpdateRefreshTokenCommand } from "../application/use-cases/update-refresh-token";
import { PasswordRecoveryCommand } from "../application/use-cases/password-recovery";
import { ResendEmailCommand } from "../application/use-cases/resend-email";
// import { SessionRepository } from "src/features/sessions/repository/session.sql.repository";
import { SessionRepository } from "src/features/sessions/repository/session.typeorm.repository";
import { ConfirmEmailCommand } from "../application/use-cases/confirm-email";
import { AuthLogoutAndDeleteSessionCommand } from "../application/use-cases/auth-logout-and-delete-session";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController{
    constructor(
        protected sessionRepository: SessionRepository,
        protected jwtService: JwtService,
        private commandBus: CommandBus
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')//---------------------------
    @HttpCode(200)
    async authLoginUser(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
            // console.log('user', req.user)//-----------------------
            if(!req.user) throw new UnauthorizedException()
            const { accessToken, refreshToken } = this.jwtService.generateToken(req.user);

            await this.commandBus.execute(new CreateSessionCommand(
                req.user!.userId,
                refreshToken,
                req.headers["user-agent"] || "unknown",
                req.ip || "unknown"
            ))

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        return { accessToken };
    }

    @Post('password-recovery')//-------------------
    @HttpCode(204)
    async authPasswordRecovery(@Body() body: RegistrationEmailResending) {
        // await this.authService.passwordRecovery(body.email);
        await this.commandBus.execute(new PasswordRecoveryCommand(body.email));
    }

    @Post('new-password')//------------------
    @HttpCode(204)
    async authNewPassword(@Body() body: NewPasswordRecoveryInputModel) {
        // const newPassword = await this.authService.newPassword(body);
        const newPassword = await this.commandBus.execute(new NewPasswordCommand(body));
        if(!newPassword) {
            throw new BadRequestException();
        }
        return newPassword;
    }

    @SkipThrottle()
    @ApiSecurity('refreshToken')
    @UseGuards(CheckTokenAuthGuard)
    @Post('refresh-token')//-----------------
    async authRefreshToken(
        @Res() res: Response,
        @Req() req: Request) {
            if(!req.user) throw new UnauthorizedException()
            if(!req.deviceId) throw new UnauthorizedException()
            const device = await this.sessionRepository.findSessionFromDeviceId(req.deviceId); // ???
            if (!device) {
                throw new UnauthorizedException();
            }
            // const result = await this.authService.updateRefreshToken(req.user, req.deviceId);
            const result = await this.commandBus.execute(new UpdateRefreshTokenCommand(req.user, req.deviceId));

            const { accessToken, refreshToken } = result;
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
                .status(200).json({ accessToken });
        }

    @Post('registration')//-----------------
    @HttpCode(204)
    async authRegistration(@Body() body: UserInputModel) {
        // const registrationResult = await this.authService.registerUser(body);
        // const registrationResult = await this.registerUserUseCase.execute(body);
        const registrationResult = await this.commandBus.execute(new RegisterUserCommand(body));
        if(!registrationResult) {
            throw new BadRequestException();
        }
        return registrationResult;
    }

    @Post('registration-confirmation')
    @HttpCode(204)
    async authRegistrationConfirmation(@Body() body: RegistrationConfirmationCodeModel) {
        // const result = await this.authService.confirmEmail(body.code);
        const result = await this.commandBus.execute(new ConfirmEmailCommand(body.code));
        if(!result) {
            throw new BadRequestException();
        }
        return result;
    }

    @Post('registration-email-resending')//-------------------
    @HttpCode(204)
    async authRegistrationEmailResending(@Body() body: RegistrationEmailResending) {
        // const emailResending = await this.authService.resendEmail(body.email);
        const emailResending = await this.commandBus.execute(new ResendEmailCommand(body.email));
        if(!emailResending) {
            throw new BadRequestException();
        }
        return emailResending;
    }

    @SkipThrottle()
    @ApiSecurity('refreshToken')
    @UseGuards(CheckTokenAuthGuard)
    @Post('logout')//---------------------
    @HttpCode(204)
    async authLogout(
        @Res() res: Response,
        @Req() req: Request) {
            if(!req.deviceId) throw new UnauthorizedException();
            const session = await this.sessionRepository.findSessionFromDeviceId(req.deviceId);
            // console.log('session', session);//--------------------
            if (!session) {
                throw new UnauthorizedException();
            }
            // const result = await this.authService.authLogoutAndDeleteSession(req.deviceId);
            const result = await this.commandBus.execute(new AuthLogoutAndDeleteSessionCommand(session.device_id));
            if (result) {
                res.clearCookie('refreshToken').sendStatus(204);
                return
            }
        return res.sendStatus(418);
    }

    @SkipThrottle()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')//----------------------
    async getUserInform(
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request) {
            if(!request.user) throw new UnauthorizedException()
        const {login, email, userId} = request.user // as { login: string, email: string, userId: string }

        const result: MeViewModel = { login, email, userId };
        return result;
    }
}