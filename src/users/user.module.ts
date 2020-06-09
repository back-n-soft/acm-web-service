import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {UserResolver} from "./user.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {TmpUser} from "./Tmp-user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([User, TmpUser])],
    providers: [UserService, UserResolver],
    exports: [UserService]
})

export class UserModule {
}