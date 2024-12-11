// // src/infrastructure/web/routes/postRoutes.ts

// import express from 'express';
// import { MongoPostRepository } from '../../infrastructure/database/MongoPostRepository';
// import { PostUseCase } from '../../application/usecases/postUseCases';
// import { PostController } from '../controllers/PostController';

// const router = express.Router();

// // Initialize dependencies
// const postRepository = new MongoPostRepository();
// const postUseCase = new PostUseCase(postRepository);
// const postController = new PostController(postUseCase);

// // Define routes
// router.post('/', (req, res, next) => postController.createPost(req, res, next));
// router.get('/:id', (req, res, next) => postController.getPostById(req, res, next));
// router.put('/update/:id', (req, res, next) => postController.updatePost(req, res, next));
// router.delete('/delete/:id', (req, res, next) => postController.deletePost(req, res, next));
// router.get('/', (req, res, next) => postController.getAllPosts(req, res, next));

// export default router;
