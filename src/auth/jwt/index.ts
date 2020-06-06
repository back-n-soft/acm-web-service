import {ENV} from "../../shared/config/env.config";
import {sign, verify} from 'jsonwebtoken'
import {User} from "../../users/entity/user.entity";
import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {getRepository} from "typeorm";


type TokenType =
    | 'accessToken'
    | 'refreshToken'
    | 'resetPasswordToken'

const common = {
    accessToken: {
        privateKey: ENV.ACCESS_TOKEN_SECRET!,
        signOptions: {
            expiresIn: ENV.ACCESS_TOKEN_EXPIRATION
        }
    },
    refreshToken: {
        privateKey: ENV.REFRESH_TOKEN_SECRET!,
        signOptions: {
            expiresIn: ENV.REFRESH_TOKEN_EXPIRATION
        }
    }
    ,
    resetPassToken: {
        privateKey: ENV.RESETPASS_TOKEN_SECRET!,
        signOptions: {
            expiresIn: '1d'
        }
    }
}

export const generateToken = async (
    user: User,
    type: TokenType
): Promise<string> => {
    return sign({id: user.id, email: user.email, password: user.password}, common[type].privateKey, {
        algorithm: 'HS256',
        expiresIn: common[type].signOptions.expiresIn
    });
}

export const verifyToken = async (
    token: string,
    type: TokenType
): Promise<User> => {
    let currentUser
    await verify(token, common[type].privateKey, async (err, data) => {
        if (err) {
            throw new UnauthorizedException('Authentication token is invalid, please try again.')
        }
        currentUser = await getRepository(User).findOne({id: data.id})
    });
    if (currentUser) {
        return currentUser;
    }
    throw new NotFoundException('User was not found, please try again.')
}

export const tradeToken = async (user: User): Promise<any> => {
    const accessToken = await generateToken(user, 'accessToken');
    const refreshToken = await generateToken(user, 'refreshToken');
    return {accessToken, refreshToken};
}