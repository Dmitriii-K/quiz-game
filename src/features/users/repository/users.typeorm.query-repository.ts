import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.typeorm.entity';
import { TypeUserPagination } from '../api/models/input.models';
import { mapUser, PaginatorUserViewModel, UserViewModel } from '../api/models/output.models';
import { userPagination } from 'src/base/models/user.models';

@Injectable()
export class UserQueryRepository {
    constructor(
        @InjectRepository(User) protected userRepository: Repository<User>,
    ) {}

    async getAllUsers(query: TypeUserPagination): Promise<PaginatorUserViewModel> {
        const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = userPagination(query);

        const queryBuilder = this.userRepository.createQueryBuilder('user');

        // Добавляем фильтры
        if (searchEmailTerm) {
            queryBuilder.andWhere('user.email ILIKE :email', { email: `%${searchEmailTerm}%` });
        }
        if (searchLoginTerm) {
            queryBuilder.andWhere('user.login ILIKE :login', { login: `%${searchLoginTerm}%` });
        }

        // Сортировка
        queryBuilder.orderBy(`user.${sortBy}`, sortDirection.toUpperCase() as 'ASC' | 'DESC');

        // Пагинация
        queryBuilder.skip((pageNumber - 1) * pageSize).take(pageSize);

        // Получаем пользователей
        const [users, totalCount] = await queryBuilder.getManyAndCount();

        // Формируем результат
        const allUsers: PaginatorUserViewModel = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: users.map(mapUser),
        };
        return allUsers;
    }

    async getUserById(userId: string): Promise<UserViewModel | null> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
    
        if (!user) {
            return null;
        }
        return mapUser(user);
    }
}