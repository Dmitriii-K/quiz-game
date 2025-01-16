import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.typeorm.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>
    ) {}

    async insertUser(user: User): Promise<string> {
        const result = await this.usersRepository.save(user);
        return result.id;
    }

    async findUserById(userId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id: userId } });
    }

    async findUserByMiddleware(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async loginIsExist(login: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { login } });
        return count > 0;
    }

    async emailIsExist(email: string): Promise<boolean> {
        const count = await this.usersRepository.count({ where: { email } });
        return count > 0;
    }

    async findUserByLogiOrEmail(data: { login: string, email: string }): Promise<User | null> {
        return this.usersRepository.findOne({
            where: [
                { login: data.login },
                { email: data.email },
            ],
        });
    }

    // async deleteUser(userId: string): Promise<boolean> {
    //     const result = await this.usersRepository.delete(userId);
    //     return result.affected !== undefined && result.affected > 0;
    // }
        async deleteUser(userId: string): Promise<boolean> {
        const result = await this.usersRepository.delete(userId);
        return result.raw > 0;
    }

    async updateCode(newCode: string, userId: string): Promise<void> {
        await this.usersRepository.update(userId, { confirmationCode: newCode });
    }

    // async updatePassword(userId: string, pass: string): Promise<boolean> {
    //     const result = await this.usersRepository.update(userId, { password: pass });
    //     return result.affected !== undefined && result.affected > 0;
    // }
        async updatePassword(userId: string, pass: string): Promise<boolean> {
        const result = await this.usersRepository.update(userId, { password: pass });
        return result.raw > 0;
    }

    async checkUserByRegistration(login: string, email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: [
                { login },
                { email },
            ],
        });
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: [
                { login: loginOrEmail },
                { email: loginOrEmail },
            ],
        });
    }

    async createUser(user: User): Promise<string> {
        const result = await this.usersRepository.insert(user);
        return result.identifiers[0].id;
    }

    async findUserByCode(code: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { confirmationCode: code } });
    }

    async findUserByEmail(mail: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email: mail } });
    }

    // async updateConfirmation(userId: string): Promise<boolean> {
    //     const result = await this.usersRepository.update(userId, { isConfirmed: true });
    //     return result.affected !== undefined && result.affected > 0;
    // }
    async updateConfirmation(userId: string): Promise<boolean> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            return false;
        }
        user.isConfirmed = true;
        await this.usersRepository.save(user);
        return true;
    }
}