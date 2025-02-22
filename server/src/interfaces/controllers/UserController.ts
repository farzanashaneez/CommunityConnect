import { Request, Response, NextFunction } from "express";
import { sendWelcomeEmail } from "../../infrastructure/services/emailServices";
import { UserUseCases } from "../../application/usecases/userUseCases";
import { error } from "console";
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
      console.log("security registration",req.body)
      const aprtmntServc=new ApartmentService();
      const aprtmnt=await aprtmntServc.createApartmentForSecurity();
        const security=req.body;
      const { user, password } = await this.userUseCases.registerUser({...security,apartmentId:aprtmnt._id,isSecurity:true,isFilled:true});
      await sendWelcomeEmail(user.email, user.firstName, password);

      res.status(201).json({ message: "User registered successfully",  });
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
      console.log("Login error:", error);
      next(error);
    }
  }
  async loginAsSecurity(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      console.log("Login error:", error);
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
      console.log("Get users error:", error);
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
      console.log("Get users error:", error);
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
      console.log("Get user by ID error:", error);
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
      console.log(userEmail)
      const user = await this.userUseCases.getUserByEmail(userEmail);
      if (!user) {
        const error = new Error("User not found");
        (error as any).statusCode = 404;
        throw error;
      }
      res.json(user);
    } catch (error) {
      console.log("Get user by ID error:", error);
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
      console.log("---------xxx--------------",req.body)
      const updatedUser = await this.userUseCases.updateUserPassword(userId, req.body.password);
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
      console.log("add member called");
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
      console.log("Add member error:", error);
      next(error);
    }
  }

  async addFcmToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("add addFcmToken called");
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
      console.log("Add member error:", error);
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

      console.log(userId, "+++++", req.imageUrl);
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
  async getAllFCMTokens(req: Request,
    res: Response,
    next: NextFunction):Promise<void>{
try{
const tokens=await this.userUseCases.getAllFCMTokens();
res.json(tokens)
}
catch(err){
next(err)
}
  }
}
