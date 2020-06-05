import {Module} from '@nestjs/common';
import {UserModule} from "../users/user.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {ENV} from "../shared/config/env.config";
import {JwtStrategy} from "./jwt.strategy";
import {GraphqlAuthGuard} from "./graphql-auth.guard";
import {AuthResolver} from './auth.resolver';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secret: ENV.ACCESS_TOKEN_SECRET,
        }),
        UserModule
    ],
    providers: [JwtStrategy, AuthResolver, GraphqlAuthGuard],
    exports: []
})
export class AuthModule {
}