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

  async loginUser(email: string, password: string): Promise<{ token: string; user: Partial<User> } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      }
    }
  }
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
