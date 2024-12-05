// src/interfaces/routes/apartmentRoutes.ts
import express,{Response,Request,NextFunction} from 'express';
import { ApartmentController } from '../controllers/ApartmentController';
import { ApartmentUseCases } from '../../application/usecases/apartmentUseCases';
import { MongoApartmentRepository } from '../../infrastructure/database/MongoApartmentRepository';
import { adminMiddleware, authMiddleware,CustomRequest } from '../../infrastructure/middlewares/authMiddleware';

const router = express.Router();
const apartmentRepository = new MongoApartmentRepository();
const apartmentUseCases = new ApartmentUseCases(apartmentRepository);
const apartmentController = new ApartmentController(apartmentUseCases);

router.post('/', (req:CustomRequest, res:Response,next:NextFunction) => apartmentController.create(req, res,next)); 
router.get('/',authMiddleware,adminMiddleware, (req:CustomRequest, res:Response,next:NextFunction) => apartmentController.getApartments(req,res,next));

export default router;
