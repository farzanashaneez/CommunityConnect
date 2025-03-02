import { NextFunction, Request, Response } from 'express';
import { EventUseCase } from '../../application/usecases/eventUseCase';
import { CustomRequest } from '../../infrastructure/middlewares/uploadImageToCloudinary';
import notificationServices from '../../application/services/notificationServices';
import { getIO } from '../../infrastructure/services/socket';
//import { emitNotificationUpdate } from '../../infrastructure/services/socketIOServices';

export class EventController {
  constructor(private eventUseCase: EventUseCase) {}

  async createEvent(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const eventData = {
        name: req.body.name,
        date: req.body.date,
        location: JSON.parse(req.body.location),
        description: req.body.description,
        imageUrl: req.imageUrl || '',
      };

      const newEvent = await this.eventUseCase.createEvent(eventData);
      Promise.resolve().then(async () => {
      const notificationMessage = `New event created: ${newEvent.name}`;
      await notificationServices.createNotification(notificationMessage,[],true); // Send to all users
     // emitNotificationUpdate({ message: notificationMessage });
      const io=getIO();
      io.emit("notificationUpdate", notificationMessage); // Notify all clients about the new/updated notification
 
      })
      
      res.status(201).json(newEvent);

    } catch (error: any) {
      res.status(400).json({ message: 'Error creating event', error: error?.message });
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const event = await this.eventUseCase.getEventById(id);
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching event', error: error?.message });
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const eventData = req.body;
      const updatedEvent = await this.eventUseCase.updateEvent(id, eventData);
      res.json(updatedEvent);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating event', error: error?.message });
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.eventUseCase.deleteEvent(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: 'Error deleting event', error: error?.message });
    }
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await this.eventUseCase.getAllEvents();
      res.json(events);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching events', error: error?.message });
    }
  }
}
