// import mongoose, { Model, Schema } from "mongoose";
// import { Event } from "../../domain/entities/Event";
// import { EventRepository } from "../../application/interfaces/EventRepository";

// const eventSchema = new Schema<Event>({
//   name: { type: String, required: true },
//   date: { type: Date, required: true },
//   location: { type: String, required: true },
//   organizer: { type: String, required: true },
//   description: { type: String },
//   attendees: { type: [String] },
//   status: { type: String, enum: ['scheduled', 'completed'], required: true },
// });

// const EventModel = mongoose.model<Event>("Event", eventSchema);

// export class MongoEventRepository implements EventRepository {
//   async createEvent(event: Partial<Event>): Promise<Event> {
//     const newEvent = new EventModel(event);
//     return newEvent.save();
//   }

//   async getEventById(id: string): Promise<Event | null> {
//     return EventModel.findById(id).exec();
//   }

//   async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
//     const updatedEvent = await EventModel.findByIdAndUpdate(id, eventData, { new: true }).exec();
//     if (!updatedEvent) {
//       throw new Error('Event not found');
//     }
//     return updatedEvent;
//   }

//   async deleteEvent(id: string): Promise<void> {
//     const result = await EventModel.findByIdAndDelete(id).exec();
//     if (!result) {
//       throw new Error('Event not found');
//     }
//   }

//   async getAllEvents(): Promise<Event[]> {
//     return EventModel.find().exec();
//   }

//   async getEventsByStatus(status: 'scheduled' | 'completed'): Promise<Event[]> {
//     return EventModel.find({ status }).exec();
//   }
// }
