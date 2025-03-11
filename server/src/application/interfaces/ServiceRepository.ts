import { Chat } from "../../domain/entities/chats/Chat";
import { Service,ServiceRequest } from "../../domain/entities/services/Service";

export interface ServiceRepository {
  createService(service: Partial<Service>): Promise<Service>;
  getServiceById(id: string): Promise<Service | null>;
  updateService(id: string, serviceData: Partial<Service>): Promise<Service>;
  grantservice(id: string, update: string): Promise<Service>;
  markservicecompleted(id: string, mark: string): Promise<ServiceRequest>;
  requestLocalService(servieRequest:ServiceRequest): Promise<ServiceRequest>;
  deleteService(id: string): Promise<void>;
  getAllServices(type:string): Promise<Service[]>;
  getAllServicesOfUser(type:string): Promise<Service[]>;

  getAllRequestedServices(status:string): Promise<ServiceRequest[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getServicesByType(type: 'local' | 'residential'): Promise<Service[]>;
  getServicesByStatus(status:string,type:string): Promise<Service[]>;

  contactServiceProvider(
    serviceData: Service,
    provider: string,
    requestby: string,
    shareMessage: string
  ): Promise<Chat | null>;
}