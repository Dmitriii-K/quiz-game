import { Injectable } from "@nestjs/common";
// import { UserRepository } from "../repository/users-sql-repository";
import { UserRepository } from "../repository/users.typeorm.repository";
import { User } from "../domain/user.typeorm.entity";

@Injectable()
export class UserService /*implements IUserService*/{
    constructor(private userRepository: UserRepository) {}

    async deleteUser(id: string) {
        return this.userRepository.deleteUser(id);
    }
    async validateUser(loginOrEmail: string): Promise<User | null> {
        return this.userRepository.findUserByLoginOrEmail(loginOrEmail);
    }
}