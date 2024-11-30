import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../interfaces/UserRepository";
import { User } from "../../domain/entities/User";

export class userUseCases {
  constructor(private userRepository: UserRepository) {}

  async registerUser(userData: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
    
    });
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
