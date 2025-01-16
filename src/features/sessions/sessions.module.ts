import { Module } from "@nestjs/common";
import { SessionController } from "./api/session.controller";
import { SessionsService } from "./application/session.service";
// import { SessionsQueryRepository } from "./repository/session.sql.query-repository";
import { SessionsQueryRepository } from "./repository/session.typeorm.query-repository";
// import { SessionRepository } from "./repository/session.sql.repository";
import { SessionRepository } from "./repository/session.typeorm.repository";
import { UsersModule } from "../users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./domain/session.typeorm.entity";

@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([Session])
    ],
    controllers: [SessionController],
    providers: [SessionsService, SessionRepository, SessionsQueryRepository],
    exports: [SessionRepository]
})
export class SessionsModule {}