import express from "express";
import { MongoEventRepository } from "../../infrastructure/database/MongoEventRepository";
import { EventUseCase } from "../../application/usecases/eventUseCase";
import { EventController } from "../controllers/EventController";
import {
  uploadImageToCloudinary,
  upload,
} from "../../infrastructure/middlewares/uploadImageToCloudinary";
import { authMiddleware } from "../../infrastructure/middlewares/authMiddleware";

const router = express.Router();
router.use(authMiddleware);

// Initialize dependencies
const eventRepository = new MongoEventRepository();
const eventUseCase = new EventUseCase(eventRepository);
const eventController = new EventController(eventUseCase);

// Define routes
router.post(
  "/",
  upload.single("imageUrl"),
  uploadImageToCloudinary,
  (req, res, next) => eventController.createEvent(req, res, next)
);
router.get("/:id", (req, res, next) =>
  eventController.getEventById(req, res, next)
);
router.put("/update/:id", (req, res, next) =>
  eventController.updateEvent(req, res, next)
);
router.delete("/delete/:id", (req, res, next) =>
  eventController.deleteEvent(req, res, next)
);
router.get("/", (req, res, next) =>
  eventController.getAllEvents(req, res, next)
);

export default router;
