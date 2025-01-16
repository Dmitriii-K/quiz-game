// import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
// import { Observable } from 'rxjs';
// import {Request} from "express";
// import { SETTINGS } from 'src/settings/app-settings';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class BasicGuard implements CanActivate {
//     constructor(private configService: ConfigService) {}
    
//     canActivate(
//     context: ExecutionContext,
//     ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();

//     const auth = request.headers["authorization"] as string;
//     // console.log(auth);
//     if (!auth) {
//         throw new UnauthorizedException();
//     }
//     // const buff = Buffer.from(auth.slice(6), "base64");
//     // const decodedAuth = buff.toString("utf8");

//     // const admin = this.configService.get<string>('basicAuthSettings', {infer: true}); Как заменить ???
//     // const buff2 = Buffer.from(admin, "utf8");
//     const buff2 = Buffer.from(SETTINGS.ADMIN, "utf8");
//     const codedAuth = buff2.toString("base64");

//     // if (decodedAuth === ADMIN_AUTH || auth.slice(0, 5) !== "Basic ") {
//     //   res.status(401).json({});
//     //   return;
//     // }
//     if (auth.slice(6) !== codedAuth || auth.slice(0, 6) !== "Basic ") {
//         throw new UnauthorizedException();
//     }
//     return true;
//     }
// }