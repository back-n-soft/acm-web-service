import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Roles} from "../../roles/roles.enum";
import {GqlExecutionContext} from "@nestjs/graphql";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<Roles[]>('roles', context.getHandler());
        console.log('roles in', roles);
        if (!roles) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        const userRoles = ctx.req.user;
        console.log('userRoles ', userRoles, ctx.req.user);
        return ctx.req.user?.roles.some((role: Roles) => !!roles.find(item => item === role));
    }

}