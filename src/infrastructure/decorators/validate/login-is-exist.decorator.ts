import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
// import { UserRepository } from 'src/features/users/repository/users-sql-repository';
import { UserRepository } from 'src/features/users/repository/users.typeorm.repository';

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'LoginIsExist', async: true })
@Injectable()
export class LoginIsExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersRepository: UserRepository) { }
    async validate(value: any, args: ValidationArguments) {
    const loginIsExist = await this.usersRepository.loginIsExist(value);
    return !loginIsExist;
}

    defaultMessage(validationArguments?: ValidationArguments): string {
    return `Login ${validationArguments?.value} already exist`;
}
}

export function LoginIsExist(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
    registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: LoginIsExistConstraint,
    });
    };
}