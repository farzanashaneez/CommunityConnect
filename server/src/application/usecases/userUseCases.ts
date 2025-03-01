// backend/application/useCases/userUseCases.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OtpDetails, UserRepository } from "../interfaces/UserRepository";
import { User } from "../../domain/entities/User";

export class UserUseCases {
  constructor(private userRepository: UserRepository) {}

  async registerUser(
    userData: User
  ): Promise<{ user: User; password: string }> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const createdUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return {
      user: createdUser,
      password: userData.password,
    };
  }
  async updateUserPassword(
    userId: string,
    password: string
  ): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 12);
    return this.userRepository.update(userId, {password:hashedPassword});
  }
  async loginUser(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<User>;
  } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
      { expiresIn: "7d" }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };
  }
  async loginAsSeccurity(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: Partial<User>;
  } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }
    if (!user?.isSecurity) {
      return null;
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin, role: "security" },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || "refreshsecret",
      { expiresIn: "7d" }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: "security",
      },
    };
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  async getAllsecurities(): Promise<User[]> {
    return this.userRepository.findAllSecurities();
  }
  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
  async getUserByEmail(userEmail: string): Promise<User | null> {
    return this.userRepository.findByEmail(userEmail);
  }

  async updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<User | null> {
    return this.userRepository.update(userId, userData);
  }

  async addMember(
    userId: string,
    memberData: { name: string; relation: string; profession: string }
  ): Promise<User | null> {
    return this.userRepository.addMember(userId, memberData);
  }
  async addFcmToken(
    userId: string,
    fcmToken: { token: string; deviceInfo: string; lastUsed: Date }
  ): Promise<User | null> {
    return this.userRepository.addFcmToken(userId, fcmToken);
  }
  async getAllFCMTokens(): Promise<string[]> {
    return this.userRepository.getAllFCMTokens();
  }
  async updateName(
    userId: string,
    fullName: { firstname: string; lastname: string }
  ): Promise<User | null> {
    return this.userRepository.updateName(userId, fullName);
  }

  async updateImage(userId: string, imageUrl: string): Promise<User | null> {
    return this.userRepository.updateImage(userId, imageUrl);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }

  async storeOtp(userId: string, otp: string, expiryTime: Date): Promise<void> {
    return this.userRepository.storeOtp(userId, otp, expiryTime);
  }
  async getOtpDetails(userId: string): Promise<OtpDetails | null> {
    return this.userRepository.getOtpDetails(userId);
  }
  async markOtpAsVerified(userId: string): Promise<void> {
    return this.userRepository.markOtpAsVerified(userId);
  }

}
