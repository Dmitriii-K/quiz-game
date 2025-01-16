import { Module } from "@nestjs/common";
import { UserController } from "./api/users.controller";
import { UserService } from "./application/user.service";
// import { UserRepository } from "./repository/users-sql-repository";
import { UserRepository } from "./repository/users.typeorm.repository";
// import { UserQueryRepository } from "./repository/users-sql-query-repository";
import { UserQueryRepository } from "./repository/users.typeorm.query-repository";
import { CqrsModule } from "@nestjs/cqrs";
import { AdaptersModule } from "src/infrastructure/adapters/adapters.module";
import { CreateUserUseCase } from "./application/use-cases/create-user";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./domain/user.typeorm.entity";

@Module({
    imports: [CqrsModule, 
        AdaptersModule,
        TypeOrmModule.forFeature([User])
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserQueryRepository, CreateUserUseCase],
    exports: [UserRepository, UserService]
})
export class UsersModule {
}