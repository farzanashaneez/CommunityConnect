import express from 'express';
import { UserController } from '../controllers/UserController';
import { MongoUserRepository } from '../../infrastructure/database/MongoUserRepository';
import { userUseCases } from '../../application/usecases/userUseCases';

const router = express.Router();
const userRepository = new MongoUserRepository();
const userUseCaseso = new userUseCases(userRepository);
const userController = new UserController(userUseCaseso);

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.get('/', (req, res) => userController.getUsers(req, res));

export default router;