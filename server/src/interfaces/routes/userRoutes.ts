import express from 'express';
import { UserController } from '../controllers/UserController';
import { MongoUserRepository } from '../../infrastructure/database/MongoUserRepository';
import { userUseCases } from '../../application/usecases/userUseCases';
import { authMiddleware } from '../../infrastructure/middlewares/authMiddleware';

const router = express.Router();
const userRepository = new MongoUserRepository();
const userUseCaseso = new userUseCases(userRepository);
const userController = new UserController(userUseCaseso);

router.post('/register',authMiddleware, (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.get('/', (req, res, next) => userController.getUsers(req, res, next));

export default router;