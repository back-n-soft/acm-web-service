import {Injectable, NotAcceptableException} from "@nestjs/common";
import {User} from "./entity/user.entity";
import {UserDto} from "./dto/user.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import { createHmac } from "crypto";

@Injectable()
export class UserService {


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) {
    }

    async createUser(data: UserDto): Promise<User> {
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

    async getByCredentials(email: string, passHash: string){
        return await this.userRepository.createQueryBuilder('users')
            .where('users.email = :email and users.password = :password')
            .setParameter('email', email)
            .setParameter('password', passHash)
            .getOne();
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async remove(id: number): Promise<DeleteResult> {
        let user = await this.userRepository.findOne(id);
        if (!user) {
            return await this.userRepository.delete({id: id});
        }
        throw new NotAcceptableException(
            'The user specified does not exist.',
        );
    }
}