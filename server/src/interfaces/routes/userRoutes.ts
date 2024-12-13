import { UserController } from '../controllers/UserController';
import { MongoUserRepository } from '../../infrastructure/database/MongoUserRepository';
import { UserUseCases } from '../../application/usecases/userUseCases';
import { adminMiddleware, authMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import express,{Response,Request,NextFunction} from 'express';

const router = express.Router();
const userRepository = new MongoUserRepository();
const userUseCaseso = new UserUseCases(userRepository);
const userController = new UserController(userUseCaseso);

router.post('/register',authMiddleware,adminMiddleware, (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.get('/',authMiddleware, (req, res, next) => userController.getUsers(req, res, next));
router.post('/members/:id',authMiddleware, (req:Request, res:Response, next:NextFunction) => userController.addMember(req, res, next));
router.get('/details/:id',authMiddleware, (req:Request, res:Response, next:NextFunction) => userController.getUserById(req, res, next));
router.delete('/delete/:id', (req, res,next) => userController.deleteUser(req, res,next));


export default router;