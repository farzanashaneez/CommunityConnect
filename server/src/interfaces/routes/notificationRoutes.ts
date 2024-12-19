// src/infrastructure/web/routes/notificationRoutes.ts
import express from 'express';
import { MongoNotificationRepository } from '../../infrastructure/database/MongoNotificationRepository';
import { NotificationController } from '../controllers/NotificationController';
import { NotificationUseCase } from '../../application/usecases/NotificationUseCase';

const router = express.Router();

// Initialize dependencies
const notificationRepository = new MongoNotificationRepository();
const notificationUseCase = new NotificationUseCase(notificationRepository);
const notificationController = new NotificationController(notificationUseCase);

// Define routes
router.post('/', (req, res, next) => notificationController.createNotification(req, res, next));
router.get('/:id', (req, res, next) => notificationController.getNotificationById(req, res, next));
router.put('/update/:id', (req, res, next) => notificationController.updateNotification(req, res, next));
router.delete('/delete/:id', (req, res, next) => notificationController.deleteNotification(req, res, next));
router.get('/', (req, res, next) => notificationController.getAllNotifications(req, res, next));
router.get('/user/:userId', (req, res, next) => notificationController.getNotificationsByUserId(req, res, next));

export default router;
