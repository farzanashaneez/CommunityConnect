import mongoose, { Model, Schema } from "mongoose";
import { Service,ServiceRequest } from "../../domain/entities/Service";
import { ServiceRepository } from "../../application/interfaces/ServiceRepository";

const serviceSchema = new Schema<Service>({
  name: { type: String, required: true },
  type: { type: String, enum: ['local', 'residential'], required: true },
  price: { type: Number, required: true },
  provider: { type: Schema.Types.ObjectId,
  ref:'User'
  },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['granted', 'pending','rejected'], required: true },
  createdAt: { type: Date, default: Date.now },

});

const serviceRequestSchema=new Schema<ServiceRequest>({
  requestId:{type:Schema.Types.ObjectId,
    ref:'User',
    required: true 
  },
  serviceId:{
    type:Schema.Types.ObjectId,
    ref:'Service',
    required: true 
  },
  requestedDate:{type:Date,default:Date.now()},
  status:{type:String,enum:['pending','completed'],default:'pending'}
})

const ServiceModel = mongoose.model<Service>("Service", serviceSchema);
const ServiceRequestModel=mongoose.model<ServiceRequest>("ServiceRequest",serviceRequestSchema)

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
  async grantservice(id: string,update:string): Promise<Service> {
    console.log("update",update)
    const updatedService = await ServiceModel.findByIdAndUpdate(id,{status:update}, { new: true }).exec();
    
    if (!updatedService) {
      throw new Error('Service not found');
    }
    return updatedService;
  }
  async markservicecompleted(id: string,mark:string): Promise<ServiceRequest> {
    console.log("id sr",id)
    const updatedService = await ServiceRequestModel.findByIdAndUpdate(id,{status:"completed"}, { new: true }).exec();
    if (!updatedService) {
      throw new Error('Servicerequest not found');
    }
    return updatedService;
  }
  async requestLocalService(serviceRequest:ServiceRequest): Promise<ServiceRequest>{
    console.log("in mongo service request========>",serviceRequest)
    const newServiceRequest = new ServiceRequestModel(serviceRequest)
    return await newServiceRequest.save()
  }
  async deleteService(id: string): Promise<void> {
    const result = await ServiceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Service not found');
    }
  }

  async getAllServices(type:string): Promise<Service[]> {
    return ServiceModel.find({'type':type}).exec();
  }

  async getAllRequestedServices(status:string): Promise<ServiceRequest[]> {
    const requests = await ServiceRequestModel.find({ status })
    .populate({
      path: 'serviceId',
      select: 'imageUrl name',
    })
    .populate({
      path: 'requestId',
      populate: {
        path: 'apartmentId',
        select: 'apartmentNumber buildingSection',
      },
    })
    .exec();
    const rawRequests = await ServiceRequestModel.find({ status }).lean();
console.log("mongo result of service request",rawRequests)
  return requests;
  }
  
  async getServicesByCategory(category: string): Promise<Service[]> {
    return ServiceModel.find({ category }).exec();
  }

  async getServicesByType(type: 'local' | 'residential'): Promise<Service[]> {
    console.log(type,"type")
    return ServiceModel.find({ type }).exec();
  }

  async getServicesByStatus(status:string,type:string): Promise<Service[]> {
    console.log("status ",status,"type ",type)
    return ServiceModel.find({ status,type })
    .populate({
      path: 'provider',
      populate: {
        path: 'apartmentId',
        select: 'apartmentNumber buildingSection'
      }
    }
    )
    .exec();
  }
}