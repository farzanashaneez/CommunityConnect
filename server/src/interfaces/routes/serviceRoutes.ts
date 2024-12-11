// src/infrastructure/web/routes/serviceRoutes.ts

import express from 'express';
import { MongoServiceRepository } from '../../infrastructure/database/MongoServiceRepository';
import { ServiceUseCase } from '../../application/usecases/serviceUseCases';
import { ServiceController } from '../controllers/Servicecontroller';
import { uploadImageToCloudinary,upload } from '../../infrastructure/middlewares/uploadImageToCloudinary';

const router = express.Router();

// Initialize dependencies
const serviceRepository = new MongoServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceController = new ServiceController(serviceUseCase);

// Define routes
router.post('/',upload.single('image'), uploadImageToCloudinary, (req, res,next) => serviceController.createService(req, res,next));
//router.get('/:id', (req, res,next) => serviceController.getServiceById(req, res,next));
router.put('/update/:id', (req, res,next) => serviceController.updateService(req, res,next));
router.delete('/delete/:id', (req, res,next) => serviceController.deleteService(req, res,next));
//router.get('/', (req, res,next) => serviceController.getAllServices(req, res,next));
router.get('/type/:type', (req, res,next) => serviceController.getAllServices(req, res,next));


export default router;