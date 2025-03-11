import { UserController } from "../controllers/UserController";
import { MongoUserRepository } from "../../infrastructure/database/MongoUserRepository";
import { UserUseCases } from "../../application/usecases/userUseCases";
import {
  adminMiddleware,
  authMiddleware,
} from "../../infrastructure/middlewares/authMiddleware";
import express, { Response, Request, NextFunction } from "express";
import {
  uploadImageToCloudinary,
  upload,
} from "../../infrastructure/middlewares/uploadImageToCloudinary";

const router = express.Router();
const userRepository = new MongoUserRepository();
const userUseCaseso = new UserUseCases(userRepository);
const userController = new UserController(userUseCaseso);

router.post("/register", authMiddleware, adminMiddleware, (req, res, next) =>
  userController.register(req, res, next)
);
router.post(
  "/register-security",
  authMiddleware,
  adminMiddleware,
  (req, res, next) => userController.registerSecurity(req, res, next)
);
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/security-login", (req, res, next) =>
  userController.loginAsSecurity(req, res, next)
);
router.get("/", authMiddleware, (req, res, next) =>
  userController.getUsers(req, res, next)
);
router.get("/all-securities", authMiddleware, (req, res, next) =>
  userController.securityUsers(req, res, next)
);

router.post(
  "/members/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userController.addMember(req, res, next)
);
router.post(
  "/add-fcmtoken/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userController.addFcmToken(req, res, next)
);
router.get("/get-fcmtokens", authMiddleware, (req, res, next) =>
  userController.getAllFCMTokens(req, res, next)
);

router.get("/verify-email/:email", (req, res, next) =>
  userController.getUserByEmail(req, res, next)
);
router.post(
  "/updatename/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updatName(req, res, next)
);
router.post(
  "/updatepassword/:id",
  (req: Request, res: Response, next: NextFunction) =>
    userController.updatePassword(req, res, next)
);

router.post(
  "/addprofileImage/:id",
  upload.single("image"),
  uploadImageToCloudinary,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateImage(req, res, next)
);
router.post(
  "/addcoverphoto/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateImage(req, res, next)
);

router.get(
  "/details/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUserById(req, res, next)
);
router.delete("/delete/:id", (req, res, next) =>
  userController.deleteUser(req, res, next)
);

router.get("/:userId/otp", (req: Request, res: Response, next: NextFunction) =>
  userController.sendOtp(req, res, next)
);
router.post(
  "/:userId/verify-otp",
  (req: Request, res: Response, next: NextFunction) =>
    userController.verifyOtp(req, res, next)
);

export default router;
