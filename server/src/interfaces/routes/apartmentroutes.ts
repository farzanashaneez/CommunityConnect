// src/interfaces/routes/apartmentRoutes.ts
import express from 'express';
import { ApartmentController } from '../controllers/ApartmentController';
import { ApartmentUseCases } from '../../application/usecases/apartmentUseCases';
import { MongoApartmentRepository } from '../../infrastructure/database/MongoApartmentRepository';

const router = express.Router();
const apartmentRepository = new MongoApartmentRepository();
const apartmentUseCases = new ApartmentUseCases(apartmentRepository);
const apartmentController = new ApartmentController(apartmentUseCases);

router.post('/', (req, res) => apartmentController.create(req, res)); 
router.get('/', (req, res) => apartmentController.getApartments(req, res));

export default router;