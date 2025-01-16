import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RequestUserDTO } from 'src/features/auth/api/models/input.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        // console.log( configService.get<number>('jwtSecretSettings', {infer: true}), "  configService.get<number>('jwtSecuritySettings.JWT_SECRET_KEY', {infer: true})")
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get<number>('jwtSecretSettings', {infer: true}).JWT_SECRET_KEY,
    });
}

    async validate(payload: any): Promise<RequestUserDTO | boolean> {
    // return { userId: payload.sub, username: payload.username };
    if(!payload.email || !payload.login || !payload.userId) {
        return false
    }
    return {email: payload.email, login: payload.login, userId: payload.userId};
    }
}