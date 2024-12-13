// backend/application/interfaces/UserRepository.ts
import { User } from "../../domain/entities/User";

export interface UserRepository {
    create(user: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findById(userId: string): Promise<User | null>; 
    update(userId: string, userData: Partial<User>): Promise<User | null>; 
    addMember(userId: string, memberData: { name: string; relation: string; profession: string }): Promise<User | null>; 
}