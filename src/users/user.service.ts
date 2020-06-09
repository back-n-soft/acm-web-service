import {Injectable, Logger, NotAcceptableException, NotFoundException} from "@nestjs/common";
import {User} from "./entity/user.entity";
import {UserDto} from "./dto/user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {createHmac} from "crypto";
import {TmpUser} from "./Tmp-user.entity";
import {verifyToken} from "../auth/jwt";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(TmpUser)
        private readonly tmpUserRepository: Repository<TmpUser>) {
    }

    async create(data: UserDto): Promise<User> {
        const user = await this.getByEmail(data.email);
        if (user) {
            throw new NotAcceptableException(
                'A user with the provided email already exists.',
            );
        }
        return await this.userRepository.save(
            this.userRepository.create(data),
        );
    }

    async get(id: number) {
        return await this.userRepository.findOne(id);
    }

    async findByConfirmationId(uuid: string): Promise<User> {
        const user  = verifyToken(uuid,"emailToken");
        Logger.debug(user);
        const result = await this.tmpUserRepository.findOne({uuid: uuid}, {relations: ['user']});
        if (!result?.user) throw new NotFoundException(`No temporary user with uuid: "${uuid}" found!`);
        await this.tmpUserRepository.delete({uuid: uuid});
        return result.user;
    }

    async getByEmail(email: string) {
        return await this.userRepository.createQueryBuilder('users')
            .where('users.email = :email')
            .setParameter('email', email)
            .getOne();
    }

    async getByEmailAndPassword(email: string, password: string) {
        const passHash = createHmac('sha256', password).digest('hex');
        return await this.userRepository.createQueryBuilder('users')
            .where('users.email = :email and users.password = :password')
            .setParameter('email', email)
            .setParameter('password', passHash)
            .getOne();
    }

    async getByCredentials(email: string, passHash: string) {
        return await this.userRepository.createQueryBuilder('users')
            .where('users.email = :email and users.password = :password')
            .setParameter('email', email)
            .setParameter('password', passHash)
            .getOne();
    }

    async update(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async remove(id: number): Promise<Boolean> {
        let user = await this.userRepository.findOne(id);
        let tmpUser = await this.tmpUserRepository.findOne({user: user});
        if (tmpUser) {
            await this.tmpUserRepository.delete({user: user});
        }
        if (user) {
            await this.userRepository.delete({id: id});
            return true;
        }
        throw new NotAcceptableException(
            'The user specified does not exist.',
        );
    }

    async confirmUser(user: User): Promise<User> {
        const createdUser = await this.userRepository.create(user);
        createdUser.isVerified = true;
        return await createdUser.save();
    }

    async addTmpUser(id: string, user: User): Promise<any> {
        const tmpuser = this.tmpUserRepository.create({
            uuid: id,
            user: user,
            createdAt: new Date(Date.now()).toString()
        });
        return tmpuser.save();
    }
}