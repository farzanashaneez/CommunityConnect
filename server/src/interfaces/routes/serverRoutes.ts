// src/infrastructure/web/routes/serviceRoutes.ts

import express from 'express';
import { MongoServiceRepository } from '../../infrastructure/database/MongoServiceRepository';
import { ServiceUseCase } from '../../application/usecases/serviceUseCases';
import { ServiceController } from '../controllers/Servicecontroller';

const router = express.Router();

// Initialize dependencies
const serviceRepository = new MongoServiceRepository();
const serviceUseCase = new ServiceUseCase(serviceRepository);
const serviceController = new ServiceController(serviceUseCase);

// Define routes
router.post('/', (req, res) => serviceController.createService(req, res));
router.get('/:id', (req, res) => serviceController.getServiceById(req, res));
router.put('/:id', (req, res) => serviceController.updateService(req, res));
router.delete('/:id', (req, res) => serviceController.deleteService(req, res));
router.get('/', (req, res) => serviceController.getAllServices(req, res));

export default router;