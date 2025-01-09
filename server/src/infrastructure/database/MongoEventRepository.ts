import mongoose, { Model, Schema } from "mongoose";
import { Event } from "../../domain/entities/Event";
import { EventRepository } from "../../application/interfaces/EventRepository";

const eventSchema = new Schema<Event>({
  name: { type: String, required: true },
  date: { type: Date },
  location: {lat:{type:Number},lng:{type:Number}} ,
  description: { type: String },
  status: { type: String, enum: ['scheduled','ongoing', 'completed']},
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },

});
eventSchema.pre('save', function(next) {
  const event = this as Event;
  const currentDate = new Date();

  if (event.date > currentDate) {
    event.status = 'scheduled';
  } else if (event.date.toDateString() === currentDate.toDateString()) {
    event.status = 'ongoing';
  } else {
    event.status = 'completed';
  }

  next();
});
const EventModel = mongoose.model<Event>("Event", eventSchema);

export class MongoEventRepository implements EventRepository {
  async createEvent(event: Partial<Event>): Promise<Event> {
    console.log("mongo event,",event)
    const newEvent = new EventModel(event);
    return newEvent.save();
  }

  async getEventById(id: string): Promise<Event | null> {
    return EventModel.findById(id).exec();
  }

  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    const updatedEvent = await EventModel.findByIdAndUpdate(id, eventData, { new: true }).exec();
    if (!updatedEvent) {
      throw new Error('Event not found');
    }
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<void> {
    const result = await EventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Event not found');
    }
  }

  async getAllEvents(): Promise<Event[]> {
    return EventModel.find().exec();
  }

  async getEventsByStatus(status: 'scheduled' | 'completed'): Promise<Event[]> {
    return EventModel.find({ status }).exec();
  }
  async findRecent(count: number): Promise<Event[]> {
    return EventModel.find()
      .sort({ createdAt: -1 })
      .limit(count)
      .exec();
  }
  
}
