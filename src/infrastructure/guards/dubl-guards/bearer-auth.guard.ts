import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from "express";
import { UserRepository } from 'src/features/users/repository/users-sql-repository';
import { JwtService } from 'src/infrastructure/adapters/jwt.pasport-service';

@Injectable()
export class BearerAuthGuard implements CanActivate {
    constructor(
        protected userRepository: UserRepository,
        protected jwtService: JwtService,) {}

    async canActivate(
    context: ExecutionContext,
    ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if(!request.headers.authorization) {
        throw new UnauthorizedException();
    }
    const token = request.headers.authorization.split(" ")[1];
    const payload = await this.jwtService.getUserIdByToken(token);
    if(!payload) {
        throw new UnauthorizedException();
    }
    const user = await this.userRepository.findUserByMiddleware(payload.userId)

    if(user) {
        request.user = {email: user.email, login: user.login, userId: user.id};
    } else {
        throw new UnauthorizedException();
    }
    return true;
    }
}