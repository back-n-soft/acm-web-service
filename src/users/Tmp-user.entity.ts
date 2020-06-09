import {BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./entity/user.entity";


@Entity()
export class TmpUser extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    public id: number;

    @JoinColumn()
    @OneToOne(type => User)
    public user: User;

    @Column()
    uuid: string;

    @Column()
    createdAt: string;

    constructor(tmpUser: Partial<TmpUser>) {
        super();
    }
}