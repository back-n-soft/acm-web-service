import {InjectRepository} from "@nestjs/typeorm";
import {AuthEntity} from "./auth.entity";
import {DeleteResult, FindConditions, Repository} from "typeorm";
import {UserService} from "../users/user.service";
import {ILoginFields} from "./interfaces/login";
import {IAuthResponse} from "./interfaces/auth";
import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {User} from "../users/entity/user.entity";
import {v4} from "uuid";
import {ENV} from "../shared/config/env.config";
import {generateToken} from "./jwt";


export class AuthService {

    constructor(@InjectRepository(AuthEntity) private readonly authRepository: Repository<AuthEntity>,
                private readonly userService: UserService) {
    }

    async login(data: ILoginFields): Promise<IAuthResponse> {
        const user = await this.userService.getByEmailAndPassword(data.email, data.password);
        if (!user) {
            throw new UnauthorizedException('Wrong login combination!');
        }
        return this.loginUser(user);
    }

    async refresh(where: FindConditions<AuthEntity>): Promise<IAuthResponse> {
        const authEntity = await this.authRepository.findOne({where, relations: ["user"]});

        if (!authEntity || authEntity.accessTokenExpiresAt > new Date().getTime()) {
            throw new UnauthorizedException('refresh token is not valid');
        }
        return this.loginUser(authEntity.user);
    }

    async delete(where: FindConditions<AuthEntity>): Promise<DeleteResult> {
        return this.authRepository.delete(where);
    }

    async loginUser(user: User): Promise<IAuthResponse> {
        const refreshToken = v4();
        const date = new Date();
        const loggedInAuth = await this.authRepository.findOne({relations: ["user"]});
        if (loggedInAuth) {
            return {
                accessToken: await generateToken(user, 'accessToken'),
                refreshToken: loggedInAuth.refreshToken,
                accessTokenExpiresAt: loggedInAuth.accessTokenExpiresAt,
                refreshTokenExpiresAt: loggedInAuth.refreshTokenExpiresAt,
            }
        }

        const atea: number = date.getTime() + parseInt(String(ENV.ACCESS_TOKEN_EXPIRATION));
        const rtea: number = date.getTime() + parseInt(String(ENV.REFRESH_TOKEN_EXPIRATION));

        await this.authRepository.save(
            this.authRepository.create({
                user,
                refreshToken,
                accessTokenExpiresAt: atea,
                refreshTokenExpiresAt: rtea,
            })
        )
        return {
            accessToken: await generateToken(user, 'accessToken'),
            refreshToken: refreshToken,
            accessTokenExpiresAt: date.getTime() + (ENV.ACCESS_TOKEN_EXPIRATION as number),
            refreshTokenExpiresAt: date.getTime() + (ENV.REFRESH_TOKEN_EXPIRATION as number),
        }
    }

    async changePassword(id: number, password: string) {
        let user = await this.userService.get(id);
        if (!user) {
            throw new NotFoundException('could not find user with given id');
        }
        user.password = password;
        user = await user.save();
        return !!user;
    }
}