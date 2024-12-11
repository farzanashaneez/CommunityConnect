// // src/infrastructure/web/routes/eventRoutes.ts

// import express from 'express';
// import { MongoEventRepository } from '../../infrastructure/database/MongoEventRepository';
// import { EventUseCase } from '../../application/usecases/eventUseCases';
// import { EventController } from '../controllers/EventController';

// const router = express.Router();

// // Initialize dependencies
// const eventRepository = new MongoEventRepository();
// const eventUseCase = new EventUseCase(eventRepository);
// const eventController = new EventController(eventUseCase);

// // Define routes
// router.post('/', (req, res, next) => eventController.createEvent(req, res, next));
// router.get('/:id', (req, res, next) => eventController.getEventById(req, res, next));
// router.put('/update/:id', (req, res, next) => eventController.updateEvent(req, res, next));
// router.delete('/delete/:id', (req, res, next) => eventController.deleteEvent(req, res, next));
// router.get('/', (req, res, next) => eventController.getAllEvents(req, res, next));

// export default router;
