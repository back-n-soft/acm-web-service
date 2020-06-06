import {Field, InputType, ObjectType} from "@nestjs/graphql";

@InputType()
export class LoginUser {
    @Field() readonly email: string;
    @Field() readonly password: string;
}

@ObjectType()
export class LoginResponse {
    @Field() accessToken: string;
    @Field() refreshToken?: string;
    @Field() accessTokenExpiresAt: string;
    @Field() refreshTokenExpiresAt?: string;
}