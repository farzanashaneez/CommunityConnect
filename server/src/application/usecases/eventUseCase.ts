// import { Event } from "../../domain/entities/Event";
// import { EventRepository } from "../interfaces/EventRepository";

// export class EventUseCase {
//   constructor(private eventRepository: EventRepository) {}

//   async createEvent(eventData: Partial<Event>): Promise<Event> {
//     if (!eventData.status) {
//       eventData.status = 'scheduled';
//     }
//     return this.eventRepository.createEvent(eventData);
//   }

//   async getEventById(id: string): Promise<Event | null> {
//     return this.eventRepository.getEventById(id);
//   }

//   async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
//     return this.eventRepository.updateEvent(id, eventData);
//   }

//   async deleteEvent(id: string): Promise<void> {
//     return this.eventRepository.deleteEvent(id);
//   }

//   async getAllEvents(): Promise<Event[]> {
//     return this.eventRepository.getAllEvents();
//   }

//   async getEventsByStatus(status: 'scheduled' | 'completed'): Promise<Event[]> {
//     return this.eventRepository.getEventsByStatus(status);
//   }
// }
