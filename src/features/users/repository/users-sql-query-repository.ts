import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource  } from "typeorm";
import { TypeUserPagination } from "../api/models/input.models";
import { mapUser, PaginatorUserViewModel, UserViewModel } from "../api/models/output.models";
import { userPagination } from "src/base/models/user.models";

@Injectable()
export class UserQueryRepository {
    constructor(
        @InjectDataSource() protected dataSource: DataSource,
        // @InjectRepository(User) protected userRepository: Repository<User>
) {}

    async getAllUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = userPagination(query);
    
        // Формируем фильтры
        const emailFilter = searchEmailTerm ? `"email" ILIKE '%${searchEmailTerm}%'` : null;
        const loginFilter = searchLoginTerm ? `"login" ILIKE '%${searchLoginTerm}%'` : null;
        const filters = [emailFilter, loginFilter]
            .filter(Boolean)
            .join(" OR ");
    
        // Формируем SQL запрос для получения пользователей
        const queryUsers = `
            SELECT * FROM "Users"
            ${filters ? `WHERE ${filters}`: ""}
            ORDER BY "${sortBy}" ${sortDirection.toUpperCase()}
            LIMIT ${pageSize} OFFSET ${(pageNumber - 1) * pageSize}
        `;
        // console.log(queryUsers);//--------------
        const users = await this.dataSource.query(queryUsers);
        // console.log(users);//--------------
        // Получаем общее количество пользователей
        const queryTotalCount = `
            SELECT COUNT(*) FROM "Users"
            ${filters ? `WHERE ${filters}`: ""}
        `;
        const totalCountResult = await this.dataSource.query(queryTotalCount);
        const totalCount = parseInt(totalCountResult[0].count, 10);
    
        // Формируем результат
        const newUser: PaginatorUserViewModel = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map(mapUser),
        };
        return newUser;
    }

    async getUserById(userId: string): Promise<UserViewModel | null> {
        const query = `
            SELECT * FROM "Users"
            WHERE id = $1`;
        const user = await this.dataSource.query(query, [userId]);
        //const user1 = await this.dataSource.getRepository(User).findOne({where: {id: Number(userId)}})
        //const user1 = await this.userRepository.findOne({where: {id: Number(userId)}})

        if (user.length === 0) {
            return null;
        }
        return mapUser(user[0]);
    }
}