import mongoose, { Schema } from "mongoose";
import { HallRepository } from "../../application/interfaces/HallRepository";
import { Hall } from "../../domain/entities/HallBooking";

const hallSchema = new Schema<Hall>({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    details:{ type: String, required: true },
    price: {
      morning: { type: Number, required: true },
      evening: { type: Number, required: true },
      fullDay: { type: Number, required: true },
    },
    availableSlots: {
      morning: { type: Boolean, default: false },
      evening: { type: Boolean, default: false },
      fullDay: { type: Boolean, default: false }
    },
    images:{type:[String]},
    createdAt: { type: Date, default: Date.now }
  });
  
  const HallModel = mongoose.model<Hall>("Hall", hallSchema);
  
  export class MongoHallRepository implements HallRepository {
    async create(hall: Partial<Hall>): Promise<Hall> {
      console.log("hall details ==>",hall)
      const newHall = new HallModel(hall);
      return newHall.save();
    }
  
    async findById(id: string): Promise<Hall | null> {
      return HallModel.findById(id).exec();
    }
  
    async update(id: string, hallData: Partial<Hall>): Promise<Hall | null> {
      return HallModel.findByIdAndUpdate(id, hallData, { new: true }).exec();
    }
  
    async delete(id: string): Promise<boolean> {
      const result = await HallModel.findByIdAndDelete(id).exec();
      return !!result;
    }
  
    async findAll(): Promise<Hall[]> {
      return HallModel.find().exec();
    }
  
    async findAvailable(date: Date, slot: 'morning' | 'evening' | 'fullDay'): Promise<Hall[]> {
      return HallModel.find({
        [`availableSlots.${slot}`]: true,
      }).exec();
    }
  }
  