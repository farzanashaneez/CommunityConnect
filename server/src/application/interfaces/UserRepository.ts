import { User } from "../../domain/entities/users/User";
export interface OtpDetails {
    otp: string;
    expiryTime: Date;
    verified: boolean;
  }
export interface UserRepository {
    create(user: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    findAllSecurities(): Promise<User[]>;
    findById(userId: string): Promise<User | null>; 
    update(userId: string, userData: Partial<User>): Promise<User | null>; 
    addMember(userId: string, memberData: { name: string; relation: string; profession: string }): Promise<User | null>; 
    addFcmToken(userId: string, fcmToken: { token: string; deviceInfo: string; lastUsed: Date }): Promise<User | null>; 
    getAllFCMTokens():Promise<string[]>;
    updateName(userId: string, fullName: { firstname: string; lastname: string; }): Promise<User | null>; 
    updateImage(userId: string, imageUrl: string): Promise<User | null>; 
    storeOtp(userId: string, otp: string, expiryTime: Date): Promise<void>;
    getOtpDetails(userId: string): Promise<OtpDetails | null>;
    markOtpAsVerified(userId: string): Promise<void>;
}