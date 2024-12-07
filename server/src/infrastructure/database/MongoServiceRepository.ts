import mongoose, { Model, Schema } from "mongoose";
import { Service } from "../../domain/entities/Service";
import { ServiceRepository } from "../../application/interfaces/ServiceRepository";

const serviceSchema = new Schema<Service>({
  name: { type: String, required: true },
  type: { type: String, enum: ['local', 'residential'], required: true },
  price: { type: Number, required: true },
  provider: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['granted', 'pending'], required: true },
});

const ServiceModel = mongoose.model<Service>("Service", serviceSchema);

export class MongoServiceRepository implements ServiceRepository {
  async createService(service: Partial<Service>): Promise<Service> {
    const newService = new ServiceModel(service);
    return newService.save();
  }

  async getServiceById(id: string): Promise<Service | null> {
    return ServiceModel.findById(id).exec();
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
    const updatedService = await ServiceModel.findByIdAndUpdate(id, serviceData, { new: true }).exec();
    if (!updatedService) {
      throw new Error('Service not found');
    }
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    const result = await ServiceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Service not found');
    }
  }

  async getAllServices(): Promise<Service[]> {
    return ServiceModel.find().exec();
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return ServiceModel.find({ category }).exec();
  }

  async getServicesByType(type: 'local' | 'residential'): Promise<Service[]> {
    return ServiceModel.find({ type }).exec();
  }

  async getServicesByStatus(status: 'granted' | 'pending'): Promise<Service[]> {
    return ServiceModel.find({ status }).exec();
  }
}