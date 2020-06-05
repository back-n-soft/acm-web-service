import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {UserDto} from "./user.dto";

@InputType()
export class LoginUser {
    @Field() readonly email: string;
    @Field() readonly password: string;
}

@ObjectType()
export class LoginResponse {
    @Field() accessToken: string;
    @Field() refreshToken: string;
    @Field() currentUser: UserDto;
}