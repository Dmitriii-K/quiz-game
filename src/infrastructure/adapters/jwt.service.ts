// import  jwt from 'jsonwebtoken';
// import { randomUUID } from 'crypto';
// import { Injectable } from '@nestjs/common';
// import { RequestUserDTO } from 'src/features/auth/api/models/input.model';
// import { ConfigService } from '@nestjs/config';



// export type PayloadType  = {
// userId: number;
// email: string,
// login: string,
// deviceId: string,
// }

// export type SystemPayload = {
// iat: any
// exp: any
// }

// export type UnionPayload = PayloadType & SystemPayload

// @Injectable()
// export class JwtService /*implements IJwtService*/ {
//     private secretKey: string
//     constructor(private configService: ConfigService) {
//         this.secretKey = this.configService.get<string>('jwtSecretSettings.JWT_SECRET_KEY', {infer: true}) as Required<string>
//     }// Как подключить ?
    
// generateToken(user: RequestUserDTO, deviceId?: string): { accessToken: string, refreshToken: string } {
//     const payload: PayloadType = {
//         userId: user.userId,
//         email: user.email,
//         login: user.login,
//         deviceId: deviceId ?? randomUUID()
//     };
//     const optionsAccessToken = {// прописать в конфиг по необходимости
//         expiresIn: '10s'
//     };
//     const optionsRefreshToken = {
//         expiresIn: '20s'
//     };
//     //const secretKey: string = this.configService.get<string>('jwtSecretSettings.JWT_SECRET_KEY', {infer: true}) as Required<string>;
//     // console.log(secretKey)
//     const accessToken: string = jwt.sign(payload, this.secretKey, optionsAccessToken);
//     const refreshToken: string = jwt.sign(payload, this.secretKey, optionsRefreshToken);
//     return { accessToken, refreshToken };
// }

// getUserIdByToken(token: string): UnionPayload | null {
//     try {
//         //const secretKey = this.configService.get<string>('jwtSecretSettings.JWT_SECRET_KEY', {infer: true})  as Required<string>;// почему number ???
//         return jwt.verify(token, this.secretKey) as unknown as UnionPayload;
//     } catch (error) {
//         // console.log(error, " error")
//         return null;
//     }
// }
// }