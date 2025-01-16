import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from "express";
// import { UserRepository } from 'src/features/users/repository/users-sql-repository';
import { UserRepository } from 'src/features/users/repository/users.typeorm.repository';
import { JwtService } from '../../adapters/jwt.pasport-service';
// import { SessionRepository } from 'src/features/sessions/repository/session.sql.repository';
import { SessionRepository } from 'src/features/sessions/repository/session.typeorm.repository';

@Injectable()
export class CheckTokenAuthGuard implements CanActivate {
    constructor(
        protected sessionsRepository: SessionRepository,
        protected jwtService: JwtService,
        protected userRepository: UserRepository
        ) {}

    async canActivate(
    context: ExecutionContext,
    ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest<Request>();
    if(!request.cookies.refreshToken) {
        throw new UnauthorizedException();
    }
    const token = request.cookies.refreshToken;
    const payload =  await this.jwtService.getUserIdByToken(token);
    if(!payload) 
        throw new UnauthorizedException();
    
    const user = await this.userRepository.findUserByMiddleware(payload.userId)
    // console.log(user); //--------------
    if(user) {
        request.user = {email: user.email, login: user.login, userId: user.id};;
        request.deviceId = payload.deviceId;

        const session = await this.sessionsRepository.findSessionByMiddleware(request.deviceId!);
        const dateIat = new Date(payload.iat * 1000).toISOString();
        if(session?.iat !== dateIat) {
            throw new UnauthorizedException();
        }
        return true;
    }
    throw new UnauthorizedException();
}
}