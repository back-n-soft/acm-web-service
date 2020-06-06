import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {UserService} from "../users/user.service";
import {LoginResponse, LoginUser} from "../users/dto/login-user";
import {UserDto} from "../users/dto/user.dto";
import {UserInput} from "../users/input/user.input";
import {User} from "../users/entity/user.entity";
import {AuthService} from "./auth.service";
import {IAuthResponse} from "./interfaces/auth";

@Resolver()
export class AuthResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {
    }

    @Mutation(() => LoginResponse)
    async login(@Args('input') input: LoginUser): Promise<IAuthResponse> {
        return this.authService.login(input);
    }

    @Mutation(() => LoginResponse)
    async refreshToken(@Args('refreshToken') refreshToken: string): Promise<IAuthResponse> {
        return this.authService.refresh({refreshToken});
    }

    @Mutation(() => UserDto)
    async signUp(@Args('data') data: UserInput): Promise<User> {
        return this.userService.create(data);
    }

    @Mutation(() => Boolean)
    async logout(@Args('refreshToken')refreshToken: string): Promise<boolean> {
        await this.authService.delete({refreshToken});
        return true;
    }
}
