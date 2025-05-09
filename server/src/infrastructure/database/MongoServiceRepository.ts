import mongoose, { Model, Schema } from "mongoose";
import { Service, ServiceRequest } from "../../domain/entities/services/Service";
import { ServiceRepository } from "../../application/interfaces/ServiceRepository";
import { Chat, Message } from "../../domain/entities/chats/Chat";
import UserService from "../../application/services/UserService";
import ChatService from "../../application/services/ChatService";

const serviceSchema = new Schema<Service>({
  name: { type: String, required: true },
  type: { type: String, enum: ["local", "residential"], required: true },
  price: { type: Number, required: true },
  provider: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ["granted", "pending", "rejected"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const serviceRequestSchema = new Schema<ServiceRequest>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    requestedDate: { type: Date, default: Date.now() },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ServiceModel = mongoose.model<Service>("Service", serviceSchema);
const ServiceRequestModel = mongoose.model<ServiceRequest>(
  "ServiceRequest",
  serviceRequestSchema
);

export class MongoServiceRepository implements ServiceRepository {
  async createService(service: Partial<Service>): Promise<Service> {
    const newService = new ServiceModel(service);
    return newService.save();
  }

  async getServiceById(id: string): Promise<Service | null> {
    return ServiceModel.findById(id).exec();
  }

  async updateService(
    id: string,
    serviceData: Partial<Service>
  ): Promise<Service> {
    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      serviceData,
      { new: true }
    ).exec();
    if (!updatedService) {
      throw new Error("Service not found");
    }
    return updatedService;
  }
  async grantservice(id: string, update: string): Promise<Service> {
    const updatedService = await ServiceModel.findByIdAndUpdate(
      id,
      { status: update },
      { new: true }
    ).exec();

    if (!updatedService) {
      throw new Error("Service not found");
    }
    return updatedService;
  }
  async markservicecompleted(
    id: string,
    mark: string
  ): Promise<ServiceRequest> {
    const updatedService = await ServiceRequestModel.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    ).exec();
    if (!updatedService) {
      throw new Error("Servicerequest not found");
    }
    return updatedService;
  }
  async requestLocalService(
    serviceRequest: ServiceRequest
  ): Promise<ServiceRequest> {
    const newServiceRequest = new ServiceRequestModel(serviceRequest);
    return await newServiceRequest.save();
  }
  async deleteService(id: string): Promise<void> {
    const result = await ServiceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error("Service not found");
    }
  }

  async getAllServices(type: string): Promise<Service[]> {
    return ServiceModel.find({ type: type }).sort({ createdAt: -1 }).exec();
  }
  async getAllServicesOfUser(userId: string): Promise<Service[]> {
    return ServiceModel.find({ provider: userId, status: "granted" })
      .sort({ createdAt: -1 })
      .exec();
  }
  async getAllRequestedServices(status: string): Promise<ServiceRequest[]> {
    const requests = await ServiceRequestModel.find({
      status,
      serviceId: { $ne: null },
      requestId: { $ne: null }
    })
    .populate({
      path: "serviceId",
      select: "imageUrl name",
    })
    .populate({
      path: "requestId",
      populate: {
        path: "apartmentId",
        select: "apartmentNumber buildingSection",
      },
    })
    .sort({ createdAt: -1 })
    .exec();
    
    const filteredRequests = requests.filter(req =>
      req.serviceId != null && req.requestId != null
    );
    
    return filteredRequests;
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return ServiceModel.find({ category }).sort({ createdAt: -1 }).exec();
  }

  async getServicesByType(type: "local" | "residential"): Promise<Service[]> {
    return ServiceModel.find({ type }).exec();
  }

  async getServicesByStatus(status: string, type: string): Promise<Service[]> {
    return ServiceModel.find({ status, type})
      .populate({
        path: "provider",
        match: {},
        populate: {
          path: "apartmentId",
          select: "apartmentNumber buildingSection",
        },
      })
      .sort({ updatedAt: -1 })
      .exec()
      .then((services) => services.filter((service) => service.provider)); 

  }
  async findRecent(count: number): Promise<Service[]> {
    return ServiceModel.find().sort({ createdAt: -1 }).limit(count).exec();
  }
  async findRecentRequestedServices(count: number): Promise<ServiceRequest[]> {
    const requests = await ServiceRequestModel.find({ 
      status: "pending",
      serviceId: { $ne: null },
      requestId: { $ne: null }
    })
    .populate({
      path: "serviceId",
      select: "imageUrl name",
    })
    .populate({
      path: "requestId",
      populate: {
        path: "apartmentId",
        select: "apartmentNumber buildingSection",
      },
    })
    .sort({ requestedDate: -1 })
    .exec();
    
    const filteredRequests = requests.filter(req => 
      req.serviceId != null && req.requestId != null
    );
    
    return filteredRequests.slice(0, 10);
  }

  async contactServiceProvider(
    serviceData: Service,
    provider: string,
    requestby: string,
    shareMessage: string
  ): Promise<Chat | null> {
    try {
      const service = await ServiceModel.findById(serviceData._id);
      if (!service) {
        throw new Error("Post not found");
      }

      const serviceprovider = await UserService.getUser(provider);
      if (!serviceprovider) {
        throw new Error("provider not found");
      }


      let chat = await ChatService.getChatbyparticipants(provider, requestby);
      if (!chat) {
        chat = await ChatService.createchat(
          {
            participants: [provider, requestby],
            type: "personal",
            createdBy: requestby,
          },
          "personal"
        );
      }

      let message;
      if (chat) {
        message = await ChatService.addMessage(chat._id, {
          senderId: requestby,
          content: shareMessage,
          status: "sent",
        });

      }

      return chat;
    } catch (error) {
      console.error("Error in sharePost:", error);
      throw error; // Re-throw the error to be handled by the route handler
    }
  }
}
