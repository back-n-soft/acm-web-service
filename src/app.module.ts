import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {UserModule} from "./users/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ENV} from "./shared/config/env.config";
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            context: ({req}) => ({req})
        }),
        TypeOrmModule.forRoot({
            type: ENV.DATABASE_TYPE as any,
            host: ENV.DATABASE_HOST,
            port: ENV.DATABASE_PORT as any,
            username: ENV.DATABASE_USERNAME,
            password: ENV.DATABASE_PASSWORD,
            database: ENV.DATABASE_NAME,
            synchronize: true,
            dropSchema: false,
            logging: true,
            entities: [
                'dist/**/**.entity.*',
            ],
            autoLoadEntities: true,
        }),
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}