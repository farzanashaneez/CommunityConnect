import mongoose, { Schema, Model } from 'mongoose';
import { Apartment } from '../../domain/entities/Apartment';
import { ApartmentRepository } from '../../application/interfaces/ApartmentRepository';

const apartmentSchema = new Schema<Apartment>({
  type: { type: String, enum: ['1BHK', '2BHK', '3BHK','security'], required: true },
  buildingSection: { type: String, enum: ['A', 'B', 'C', 'D', 'E','S'], required: true },
  apartmentNumber: { type: Number, required: true },
  isfilled: { type: Boolean, default: false }, // Default value set to 0
});

const ApartmentModel: Model<Apartment> = mongoose.model<Apartment>('Apartment', apartmentSchema);

export class MongoApartmentRepository implements ApartmentRepository {
  async create(apartment: Apartment): Promise<Apartment> {
    const newApartment = new ApartmentModel(apartment);
    return newApartment.save();
  }
  async createApartmentForSecurity(): Promise<Apartment> {
    const apartment={
      type:'security',
      buildingSection:'S',
      apartmentNumber:'101',
      isFilled:true
    }
    const newApartment = new ApartmentModel(apartment);
    return newApartment.save();
  }

  async findAll(): Promise<Apartment[]> {
    return ApartmentModel.find({type:{$ne:'security'}}).exec(); // Fetch all apartments from the database
  }
  async getapartmentCount():Promise<number>{
    return ApartmentModel.countDocuments().exec();
  }
  async markFilled(id:string,doFill:boolean){
   
    const aprtmnt=await ApartmentModel.findByIdAndUpdate(id, { isfilled:doFill }, { new: true });
    console.log("updated apartment",aprtmnt)
  }
}