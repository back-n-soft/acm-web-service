import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/entity/user.entity";


@Entity()
export class AuthEntity extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    public refreshToken: string;

    @Column({type:'bigint'})
    public refreshTokenExpiresAt: number

    public accessToken: string;

    @Column({type: 'bigint'})
    public accessTokenExpiresAt: number;

    @JoinColumn()
    @OneToOne(type => User)
    public user: User;

}