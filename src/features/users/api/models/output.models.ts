import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../domain/user.typeorm.entity";

export class UserViewModel {
    @ApiProperty()
    id: string;
    @ApiProperty()
    login: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    createdAt: Date;
}

export class PaginatorUserViewModel {
    @ApiProperty()
    pagesCount: number;
    @ApiProperty()
    page: number;
    @ApiProperty()
    pageSize: number;
    @ApiProperty()
    totalCount: number;
    @ApiProperty({type: [UserViewModel],})
    items: UserViewModel[];
}

export function mapUser(user: User): UserViewModel {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}