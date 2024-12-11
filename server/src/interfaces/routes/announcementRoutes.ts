// // src/infrastructure/web/routes/announcementRoutes.ts

// import express from 'express';
// import { MongoAnnouncementRepository } from '../../infrastructure/database/MongoAnnouncementRepository';
// import { AnnouncementUseCase } from '../../application/usecases/announcementUseCases';
// import { AnnouncementController } from '../controllers/AnnouncementController';

// const router = express.Router();

// // Initialize dependencies
// const announcementRepository = new MongoAnnouncementRepository();
// const announcementUseCase = new AnnouncementUseCase(announcementRepository);
// const announcementController = new AnnouncementController(announcementUseCase);

// // Define routes
// router.post('/', (req, res, next) => announcementController.createAnnouncement(req, res, next));
// router.get('/:id', (req, res, next) => announcementController.getAnnouncementById(req, res, next));
// router.put('/update/:id', (req, res, next) => announcementController.updateAnnouncement(req, res, next));
// router.delete('/delete/:id', (req, res, next) => announcementController.deleteAnnouncement(req, res, next));
// router.get('/', (req, res, next) => announcementController.getAllAnnouncements(req, res, next));

// export default router;
