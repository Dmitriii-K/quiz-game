import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestUserDTO } from 'src/features/auth/api/models/input.model';
import { randomUUID } from 'crypto';

@Injectable()
export class JwtService {
    constructor(
        private readonly nestJwtService: NestJwtService,
        private readonly configService: ConfigService) {}

generateToken(user: RequestUserDTO, deviceId?: string): { accessToken: string, refreshToken: string } {
    const payload = {
        userId: user.userId,
        email: user.email,
        login: user.login,
        deviceId: deviceId ?? randomUUID(),
    };

    const secretKey = this.configService.get<string>('jwtSecretSettings.JWT_SECRET_KEY', {infer: true});

    const accessToken = this.nestJwtService.sign(payload, {
        secret: secretKey,
        expiresIn: '50000s',
        // expiresIn: '10s',
    });

    const refreshToken = this.nestJwtService.sign(payload, {
        secret: secretKey,
        expiresIn: '70000s',
        // expiresIn: '20s',
    });

    return { accessToken, refreshToken };
}

async getUserIdByToken(token: string){
    try {
        const secretKey = this.configService.get<string>('jwtSecretSettings.JWT_SECRET_KEY', {infer: true});
        return this.nestJwtService.verify(token, { secret: secretKey });
    } catch (error) {
        return null;
    }
}
}