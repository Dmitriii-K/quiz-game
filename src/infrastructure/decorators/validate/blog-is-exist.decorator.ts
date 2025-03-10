import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { BlogRepository } from 'src/features/bloggers_platform/blogs/repository/blog.typeorm.repository';

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'BlogIsExist', async: true })
@Injectable()
export class BlogIsExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogRepository: BlogRepository) { }
    async validate(value: any, args: ValidationArguments) {
    const blogIsExist = await this.blogRepository.blogIsExist(value);
    return blogIsExist;
}

    defaultMessage(validationArguments?: ValidationArguments): string {
    return `BlogId ${validationArguments?.value} not exist`;
    }
}

export function BlogIsExist(
    property?: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
    registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: BlogIsExistConstraint,
    });
    };
}