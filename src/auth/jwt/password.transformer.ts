import * as crypto from 'crypto';
import {ValueTransformer} from "typeorm";

export class PasswordTransformer implements ValueTransformer {
    from(value: any): any {
        return value;
    }

    to(value: any): any {
        return crypto.createHmac('sha256', value).digest('hex');
    }

}