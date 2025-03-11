import express, { Response, Request, NextFunction } from "express";
import { MongoPostRepository } from "../../infrastructure/database/MongoPostRepository";
import { PostUseCase } from "../../application/usecases/postUseCase";
import { PostController } from "../controllers/PostController";
import {
  CustomRequestWithImageArray,
  upload,
  uploadImageArrayToCloudinary,
} from "../../infrastructure/middlewares/uploadImageToCloudinary";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = express.Router();
router.use(authMiddleware);

// Initialize dependencies
const postRepository = new MongoPostRepository();
const postUseCase = new PostUseCase(postRepository);
const postController = new PostController(postUseCase);

// Define routes
router.post(
  "/",
  (req, res, next) => {
    upload.array("images", 5)(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).send({ error: "File upload failed" });
      }
      next();
    });
  },
  uploadImageArrayToCloudinary,
  (req: CustomRequestWithImageArray, res: Response, next: NextFunction) =>
    postController.createPost(req, res, next)
);
router.get("/", (req: Request, res: Response, next: NextFunction) =>
  postController.getAllPosts(req, res, next)
);
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  postController.getPostById(req, res, next)
);
router.put("/:id", (req: Request, res: Response, next: NextFunction) =>
  postController.updatePost(req, res, next)
);
router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  postController.deletePost(req, res, next)
);
router.get("/user/:userid", (req: Request, res: Response, next: NextFunction) =>
  postController.getPostsByUser(req, res, next)
);
router.post("/:id/like", (req: Request, res: Response, next: NextFunction) =>
  postController.addLike(req, res, next)
);
router.post("/:id/comment", (req: Request, res: Response, next: NextFunction) =>
  postController.addComment(req, res, next)
);
router.post(
  "/share-post/:postid",
  (req: Request, res: Response, next: NextFunction) =>
    postController.sharePost(req, res, next)
);

export default router;
