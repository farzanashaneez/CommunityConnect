// src/infrastructure/web/routes/announcementRoutes.ts

import express from 'express';
import { MongoAnnouncementRepository } from '../../infrastructure/database/MongoAnnouncementRepository';
import { AnnouncementUseCase } from '../../application/usecases/announcementUseCase';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { uploadImageToCloudinary,upload } from '../../infrastructure/middlewares/uploadImageToCloudinary';
import { authMiddleware ,adminMiddleware} from '../../infrastructure/middlewares/authMiddleware';

const router = express.Router();
router.use(authMiddleware)
// Initialize dependencies
const announcementRepository = new MongoAnnouncementRepository();
const announcementUseCase = new AnnouncementUseCase(announcementRepository);
const announcementController = new AnnouncementController(announcementUseCase);

// Define routes
router.post('/',adminMiddleware,upload.single('imageUrl'), uploadImageToCloudinary, (req, res, next) => announcementController.createAnnouncement(req, res, next));
router.get('/:id', (req, res, next) => announcementController.getAnnouncementById(req, res, next));
router.put('/update/:id',adminMiddleware, (req, res, next) => announcementController.updateAnnouncement(req, res, next));
router.delete('/delete/:id',adminMiddleware, (req, res, next) => announcementController.deleteAnnouncement(req, res, next));
router.get('/', (req, res, next) => announcementController.getAllAnnouncements(req, res, next));

export default router;
