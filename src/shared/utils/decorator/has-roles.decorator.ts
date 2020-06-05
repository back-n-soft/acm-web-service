import {Roles} from "../../roles/roles.enum";
import {SetMetadata} from "@nestjs/common";


export const HasRoles = (...roles: Array<Roles>): ((target: object, key?: any, descriptor?: any) => any) =>
    SetMetadata("roles", [...roles]);
