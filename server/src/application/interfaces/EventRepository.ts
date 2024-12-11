import { Event } from "../../domain/entities/Event";

export interface EventRepository {
  createEvent(event: Partial<Event>): Promise<Event>;
  getEventById(id: string): Promise<Event | null>;
  updateEvent(id: string, eventData: Partial<Event>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  getAllEvents(): Promise<Event[]>;
  getEventsByStatus(status: 'scheduled' | 'completed'): Promise<Event[]>;
}
