import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ENV} from "../shared/config/env.config";
import {User} from "../users/entity/user.entity";
import {UserService} from "../users/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey:  ENV.ACCESS_TOKEN_SECRET,
        });
    }

    async validate(payload): Promise<User> {
        const user = await this.userService.getByCredentials(payload.email, payload.password);
        // console.log('validated ',user?.email);
        if (user) {
            return user;
        }
        throw new UnauthorizedException();
    }
}