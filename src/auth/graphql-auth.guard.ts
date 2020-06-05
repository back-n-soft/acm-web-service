import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Observable} from 'rxjs';
import {GqlExecutionContext} from "@nestjs/graphql";
import {ExecutionContextHost} from "@nestjs/core/helpers/execution-context-host";

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') implements CanActivate{
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        Logger.debug('called auth guard !!', req.user);
        return super.canActivate(new ExecutionContextHost([req]));
    }
}