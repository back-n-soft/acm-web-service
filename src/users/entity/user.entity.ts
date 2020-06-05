import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {PasswordTransformer} from "../../auth/jwt/password.transformer";
import {Roles} from "../../shared/roles/roles.enum";
import {registerEnumType} from "@nestjs/graphql";

registerEnumType(Roles, {
    name: "Roles",
});


@Entity({name: 'user'})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column({
        name: 'password',
        length: 255,
        transformer: new PasswordTransformer(),
    })
    password: string;

    @Column({nullable: true,})
    country?: string;

    @Column({nullable: true})
    phoneNumber?: string;

    @Column({type: 'enum', enum: Roles, array: true, nullable: true, default: ['USER']})
    roles?: Roles[]

    constructor(user: Partial<User>) {
        super();
    }

}