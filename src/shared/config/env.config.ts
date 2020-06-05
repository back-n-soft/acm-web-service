import 'dotenv/config';

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'local',
    DOMAIN_NAME: process.env.DOMAIN_NAME || 'http://localhost:3000',
    PORT: process.env.PORT || 3000,

    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_TYPE: process.env.DATABASE_TYPE || 'postgres',
    DATABASE_PORT: process.env.DATABASE_PORT || 5432,
    DATABASE_NAME: process.env.DATABASE_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    RESETPASS_TOKEN_SECRET: process.env.RESETPASS_TOKEN_SECRET,
}