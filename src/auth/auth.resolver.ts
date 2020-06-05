import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {UnauthorizedException} from "@nestjs/common";
import {UserService} from "../users/user.service";
import {LoginResponse, LoginUser} from "../users/dto/login-user";
import {tradeToken} from "./jwt";
import {UserDto} from "../users/dto/user.dto";
import {UserInput} from "../users/input/user.input";
import {User} from "../users/entity/user.entity";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService
    ) {
    }

    @Mutation(() => LoginResponse)
    async login(@Args('input') input: LoginUser): Promise<LoginResponse> {
        const {email, password} = input

        const currentUser = await this.userService.getByEmailAndPassword(email, password);
        if (!currentUser) {
            throw new UnauthorizedException('Wrong login combination!');
        }
        let {accessToken, refreshToken} = await tradeToken(currentUser)
        return {accessToken, refreshToken, currentUser};
    }

    @Mutation(() => UserDto)
    async signUp(@Args('data') data: UserInput): Promise<User> {
        return this.userService.createUser(data);
    }
}
