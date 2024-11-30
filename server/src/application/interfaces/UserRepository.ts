import { User } from "../../domain/entities/User";

export interface UserRepository{
    create(user:User):Promise<User>;
    findByEmail(email:string):Promise<User | null>;
    findAll(): Promise<User[]>;
}