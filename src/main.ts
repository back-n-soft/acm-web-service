import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ENV} from "./shared/config/env.config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    await app.listen(ENV.PORT);
    Logger.verbose(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();