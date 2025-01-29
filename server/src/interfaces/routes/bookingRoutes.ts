import express from 'express';
import { MongoBookingRepository } from '../../infrastructure/database/MongoBookingRepository';
import { BookingController } from '../controllers/BookingController';
import { BookingUseCase } from '../../application/usecases/BookingUseCase';
import { MongoHallRepository } from '../../infrastructure/database/MongoHallRepository';

const router = express.Router();

// Initialize dependencies
const bookingRepository = new MongoBookingRepository();
const hallRepository = new MongoHallRepository();
const bookingUseCase = new BookingUseCase(bookingRepository,hallRepository);
const bookingController = new BookingController(bookingUseCase);

// Define routes
router.post('/', (req, res, next) => bookingController.createBooking(req, res, next));
router.get('/:id', (req, res, next) => bookingController.getBookingById(req, res, next));
router.put('/update/:id', (req, res, next) => bookingController.updateBooking(req, res, next));
router.delete('/delete/:id', (req, res, next) => bookingController.deleteBooking(req, res, next));
router.get('/', (req, res, next) => bookingController.getAllBookings(req, res, next));
router.get('/user/:userId', (req, res, next) => bookingController.getUserBookings(req, res, next));

router.get('/slots/:hallid/:fordays', (req, res, next) => bookingController.getAvailableSlots(req, res, next));
router.get('/slots/allslots/:hallid/:fordays', (req, res, next) => bookingController.getAllSlotsOfHall(req, res, next));
router.put('/slots/update/:slotid',(req, res, next) => bookingController.updateSlot(req, res, next))

export default router;