import { Request, Response, NextFunction } from "express";
import {
  sendOTPToEmail,
  sendWelcomeEmail,
} from "../../infrastructure/services/emailServices";
import { UserUseCases } from "../../application/usecases/userUseCases";
import { CustomRequest } from "../../infrastructure/middlewares/uploadImageToCloudinary";
import ApartmentService from "../../application/services/ApartmentService";

export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { user, password } = await this.userUseCases.registerUser(req.body);
      await sendWelcomeEmail(user.email, user.firstName, password);

      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      next(error);
    }
  }
  async registerSecurity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const aprtmntServc = new ApartmentService();
      const aprtmnt = await aprtmntServc.createApartmentForSecurity();
      const security = req.body;
      const { user, password } = await this.userUseCases.registerUser({
        ...security,
        apartmentId: aprtmnt._id,
        isSecurity: true,
        isFilled: true,
      });
      await sendWelcomeEmail(user.email, user.firstName, password);

      res.status(201).json({ message: "User registered successfully" ,user});
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await this.userUseCases.loginUser(email, password);
      if (!data?.token) {
        const error = new Error("Invalid credentials");
        (error as any).statusCode = 401;
        throw error;
      }
      res.json({ message: "Login successful", data });
    } catch (error) {
      next(error);
    }
  }
  async loginAsSecurity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await this.userUseCases.loginAsSeccurity(email, password);
      if (!data?.token) {
        const error = new Error("Invalid credentials");
        (error as any).statusCode = 401;
        throw error;
      }
      res.json({ message: "Login successful", data });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userUseCases.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
  async securityUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userUseCases.getAllsecurities();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const user = await this.userUseCases.getUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
  async getUserByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userEmail = req.params.email;

      const user = await this.userUseCases.getUserByEmail(userEmail);
      if (!user) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id; // Assuming you're passing the user ID in the URL
      const updatedUser = await this.userUseCases.updateUser(userId, req.body);
      if (!updatedUser) {
        const error = new Error("User not found");
        (error as any).statusCode = 404; // Adding a custom property for status code
        throw error;
      }
      res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;

      const updatedUser = await this.userUseCases.updateUserPassword(
        userId,
        req.body.password
      );
      if (!updatedUser) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async addMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { name, relation, profession } = req.body;

      if (!name || !relation || !profession) {
        const error = new Error("All fields are required");
        (error as any).statusCode = 404;
        throw error;
      }

      const updatedUser = await this.userUseCases.addMember(userId, {
        name,
        relation,
        profession,
      });

      if (!updatedUser) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      const members = updatedUser?.members || [];
      res.json({ message: "Member added successfully", members });
    } catch (error) {
      next(error);
    }
  }

  async addFcmToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { token, deviceInfo, lastUsed } = req.body;

      if (!token || !deviceInfo || !lastUsed) {
        const error = new Error("All fields are required");
        (error as any).statusCode = 404;
        throw error;
      }

      const updatedUser = await this.userUseCases.addFcmToken(userId, {
        token,
        deviceInfo,
        lastUsed,
      });

      if (!updatedUser) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      const fcmTokens = updatedUser?.fcmTokens || [];
      res.json({ message: "Member added successfully", fcmTokens });
    } catch (error) {
      next(error);
    }
  }
  async updatName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { firstname, lastname } = req.body;

      const updatedUser = await this.userUseCases.updateName(userId, {
        firstname,
        lastname,
      });

      res.json({ message: "Member added successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  }
  async updateImage(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const url = req.imageUrl || "";

      const updatedUser = await this.userUseCases.updateImage(userId, url);

      res.json({ message: "Member added successfully", updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.userUseCases.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error deleting service", error: error?.message });
    }
  }
  async getAllFCMTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokens = await this.userUseCases.getAllFCMTokens();
      res.json(tokens);
    } catch (err) {
      next(err);
    }
  }

  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;

      // Find the user
      const user = await this.userUseCases.getUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set expiry time (e.g., 10 minutes from now)
      const expiryTime = new Date();
      expiryTime.setMinutes(expiryTime.getMinutes() + 10);

      // Store OTP in the database
      await this.userUseCases.storeOtp(userId, otp, expiryTime);

      // Send OTP to user's email
      await sendOTPToEmail(user.email, otp);

      res.status(200).json({
        message: "OTP sent successfully",
        userId: userId,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const { otp } = req.body;

      if (!otp) {
        const error = new Error("OTP is required");
        (error as any).statusCode = 400;
        throw error;
      }

      // Find the user
      const user = await this.userUseCases.getUserById(userId);
      if (!user) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }

      // Get stored OTP details
      const otpDetails = await this.userUseCases.getOtpDetails(userId);

      if (!otpDetails) {
        const error = new Error(
          "OTP not found or expired. Please request a new OTP"
        );
        (error as any).statusCode = 400;
        throw error;
      }

      // Check if OTP is expired
      const currentTime = new Date();
      if (currentTime > otpDetails.expiryTime) {
        const error = new Error("OTP has expired. Please request a new OTP");
        (error as any).statusCode = 400;
        throw error;
      }

      // Verify OTP
      if (otpDetails.otp !== otp) {
        const error = new Error("Invalid OTP");
        (error as any).statusCode = 400;
        throw error;
      }

      // Mark OTP as verified
      await this.userUseCases.markOtpAsVerified(userId);

      res.status(200).json({
        message: "OTP verified successfully",
        userId: userId,
        verified: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
