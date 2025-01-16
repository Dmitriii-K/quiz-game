import { Global, Module } from "@nestjs/common";
import { UsersModule } from "src/features/users/users.module";
import { SessionsModule } from "src/features/sessions/sessions.module";
import { LocalStrategy } from "./pasport-strategy/local.strategy";
import { JwtStrategy } from "./pasport-strategy/jwt.strategy";
import { BasicStrategy } from "./pasport-strategy/basic.strategy";
import { SoftAuthGuard } from "./guards/dubl-guards/soft-auth.guard";
import { CheckTokenAuthGuard } from "./guards/dubl-guards/check-refresh-token.guard";
import { AdaptersModule } from "./adapters/adapters.module";

@Global()
@Module({
    imports: [SessionsModule, UsersModule, 
        AdaptersModule
    ],
    controllers: [],
    providers: [LocalStrategy, JwtStrategy, BasicStrategy, SoftAuthGuard, CheckTokenAuthGuard],
    exports: [LocalStrategy, JwtStrategy, BasicStrategy, SoftAuthGuard, CheckTokenAuthGuard]
})
export class CoreModule {
}