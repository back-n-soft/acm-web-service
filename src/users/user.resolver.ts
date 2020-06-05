import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {User} from "./entity/user.entity";
import {UserService} from "./user.service";
import {UserDto} from "./dto/user.dto";
import {HasRoles} from "../shared/utils/decorator/has-roles.decorator";
import {Roles} from "../shared/roles/roles.enum";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {CurrentUser} from "../shared/utils/decorator/user.decorator";
import {RolesGuard} from "../shared/utils/guards/roles.guard";

@UseGuards(GraphqlAuthGuard, RolesGuard)
@Resolver(of => User)
export class UserResolver {

    constructor(private readonly userService: UserService) {
    }

    @Query(() => UserDto)
    @HasRoles(Roles.ADMIN, Roles.USER)
    async getUser(@Args('id', {type: () => Int})id: number, @CurrentUser() user: UserDto) {
        console.log(user);
        return this.userService.get(id);
    }

    @Query(() => [UserDto])
    async getAllUsers(@CurrentUser() user: UserDto) {
        console.log(user);
        return this.userService.getAllUsers();
    }

    @Query(() => UserDto)
    async whoami(@CurrentUser() user: UserDto) {
        return this.userService.getByEmail(user?.email);
    }

    @Mutation(() => UserDto)
    async deleteUser(@Args('id', {type: () => Int})id: number) {
        return this.userService.remove(id);
    }

}