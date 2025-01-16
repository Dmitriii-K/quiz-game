import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BcryptService } from '../adapters/bcrypt';
import { UserService } from 'src/features/users/application/user.service';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        private bcryptService: BcryptService,
    ) {
    super({ usernameField: 'loginOrEmail',passwordField: "password" });
}
    async validate(loginOrEmail: string, password: string) {
    const user = await this.userService.validateUser(loginOrEmail);
    if (!user) {
        throw new UnauthorizedException('User is not found');
    }
    const isCorrect = await this.bcryptService.comparePasswords(password, user.password);
    if (!isCorrect) {
        throw new UnauthorizedException('Password or login is wrong');
    }
    return {email: user.email, login: user.login, userId: user.id.toString()};
    }
}