import {Field, InputType, Int, ObjectType, registerEnumType} from "@nestjs/graphql";



@ObjectType()
export class UserDto {
    @Field(type => Int) readonly id?: number;
    @Field() readonly firstName: string;
    @Field() readonly lastName: string;
    @Field() readonly email: string;
    @Field() readonly password: string;
    @Field({nullable: true}) readonly country?: string;
    @Field({nullable: true}) readonly phoneNumber?: string;
}