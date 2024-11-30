import { Request, Response } from 'express';
import { userUseCases } from '../../application/usecases/userUseCases';
import { sendWelcomeEmail } from '../../infrastructure/services/emailServices';

export class UserController {
  constructor(private userUseCases: userUseCases) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body)
      const user = await this.userUseCases.registerUser(req.body);
      await sendWelcomeEmail(user.email, user.firstName,user.password);

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: 'Registration failed', error });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.userUseCases.loginUser(email, password);
      if (!token) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(400).json({ message: 'Login failed', error });
    }
  }
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve users', error });
    }
  }
}