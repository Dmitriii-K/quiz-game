import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator";
import { Trim } from "src/infrastructure/decorators/transform/trim";
import { EmailIsExist } from "src/infrastructure/decorators/validate/email-is-exist.decorator";
import { LoginIsExist } from "src/infrastructure/decorators/validate/login-is-exist.decorator";

export class TypeUserPagination {
    @ApiProperty()
    searchLoginTerm: string;
    @ApiProperty()
    searchEmailTerm: string;
    @ApiProperty()
    sortBy: string;
    @ApiProperty()
    sortDirection: string;
    @ApiProperty()
    pageNumber: number;
    @ApiProperty()
    pageSize: number;
}
// export class TypeUserPagination {
// @ApiProperty({
//     description: 'Термин для поиска по логину',
//     required: false,
//     example: 'user',
// })
// searchLoginTerm: string;

// @ApiProperty({
//     description: 'Термин для поиска по email',
//     required: false,
//     example: 'example.com',
// })
// searchEmailTerm: string;

// @ApiProperty({
//     description: 'Поле для сортировки',
//     required: false,
//     example: 'createdAt',
// })
// sortBy: string;

// @ApiProperty({
//     description: 'Направление сортировки',
//     required: false,
//     example: 'desc',
// })
// sortDirection: string;

// @ApiProperty({
//     description: 'Номер страницы',
//     required: false,
//     example: 1,
// })
// pageNumber: number;

// @ApiProperty({
//     description: 'Количество элементов на странице',
//     required: false,
//     example: 10,
// })
// pageSize: number;
// }

export class UserInputModel {
    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(3,10)
    @Matches(/^[a-zA-Z0-9_-]*$/)
    @LoginIsExist()// в идеале проверять в BLL
    login: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(6,20)
    password: string;

    @ApiProperty()
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    @IsEmail()
    @EmailIsExist()// в идеале проверять в BLL
    email: string;
}
// export class UserInputModel {
// @ApiProperty({
//     description: 'Логин пользователя',
//     minLength: 3,
//     maxLength: 10,
//     pattern: '^[a-zA-Z0-9_-]*$',
//     example: 'user_login',
// })
// @IsString()
// @Trim()
// @IsNotEmpty()
// @Length(3, 10)
// @Matches(/^[a-zA-Z0-9_-]*$/)
// @LoginIsExist()// в идеале проверять в BLL
// login: string;

// @ApiProperty({
//     description: 'Пароль пользователя',
//     minLength: 6,
//     maxLength: 20,
//     example: 'password123',
// })
// @IsString()
// @Trim()
// @IsNotEmpty()
// @Length(6, 20)
// password: string;

// @ApiProperty({
//     description: 'Email пользователя',
//     pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
//     example: 'user@example.com',
// })
// @IsString()
// @Trim()
// @IsNotEmpty()
// @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
// @IsEmail()
// @EmailIsExist()// в идеале проверять в BLL
// email: string;
// }