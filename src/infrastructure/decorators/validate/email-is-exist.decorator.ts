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
@ValidatorConstraint({ name: 'EmailIsExist', async: true })
@Injectable()
export class EmailIsExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly usersRepository: UserRepository) { }
    async validate(value: any, args: ValidationArguments) {
    const emailIsExist = await this.usersRepository.emailIsExist(value);
    return !emailIsExist;
}

    defaultMessage(validationArguments?: ValidationArguments): string {
    return `Email ${validationArguments?.value} already exist`;
    }
}

export function EmailIsExist(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
    registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: EmailIsExistConstraint,
    });
    };
}