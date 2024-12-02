import { Request, Response, NextFunction } from 'express';
import { userUseCases } from '../../application/usecases/userUseCases';
import { sendWelcomeEmail } from '../../infrastructure/services/emailServices';

export class UserController {
  constructor(private userUseCases: userUseCases) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
      const {user,password} = await this.userUseCases.registerUser(req.body);
      console.log("user--->",user,"password---->",password)
      await sendWelcomeEmail(user.email, user.firstName,password);

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.log("============",error)
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await this.userUseCases.loginUser(email, password);
      if (!data?.token) {
        const error = new Error('Invalid credentials');
        (error as any).statusCode = 401;
        throw error;
      }
      res.json({ message: 'Login successful', data });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
}