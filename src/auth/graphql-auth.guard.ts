import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';
import {GqlExecutionContext} from "@nestjs/graphql";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";
import {Reflector} from "@nestjs/core";

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') implements CanActivate{
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
        Logger.debug('called auth guard !!');
        if (isPublic) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        return super.canActivate(new ExecutionContextHost([req]));
    }
}