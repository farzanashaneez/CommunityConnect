// src/application/useCases/ServiceUseCase.ts

import { Service,ServiceRequest } from "../../domain/entities/Service";
import { ServiceRepository } from "../interfaces/ServiceRepository";

export class ServiceUseCase {
  constructor(private serviceRepository: ServiceRepository) {}

  async createService(serviceData: Partial<Service>): Promise<Service> {
    if (serviceData.type === 'local') {
      serviceData.status = 'granted';
    } else {
      serviceData.status = 'pending';
    }
    return this.serviceRepository.createService(serviceData);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return this.serviceRepository.getServiceById(id);
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
    return this.serviceRepository.updateService(id, serviceData);
  }
async grantservice(id: string, update:string): Promise<Service> {
    return this.serviceRepository.grantservice(id, update);
  }
  async markservicecompleted(id: string, mark:string): Promise<ServiceRequest> {
    // const updatedService = await ServiceMo): Promise<Service> {
    return this.serviceRepository.markservicecompleted(id, mark);
  }
  async requestLocalService(id: string,userId:string): Promise<ServiceRequest>{

    return this.serviceRepository.requestLocalService({requestId:userId,serviceId:id});

  }

  async deleteService(id: string): Promise<void> {
    return this.serviceRepository.deleteService(id);
  }

  async getAllServices(type:string): Promise<Service[]> {
    return this.serviceRepository.getAllServices(type);
  }
  async getAllServicesOfUser(userId:string): Promise<Service[]> {
    return this.serviceRepository.getAllServicesOfUser(userId);
  }
  getAllRequestedServices(status:string): Promise<ServiceRequest[]>{
    return this.serviceRepository.getAllRequestedServices(status);

  }
  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.serviceRepository.getServicesByCategory(category);
  }

  async getServicesByType(type: 'local' | 'residential'): Promise<Service[]> {
    return this.serviceRepository.getServicesByType(type);
  }

  async getServicesByStatus(status:string,type:string): Promise<Service[]> {
    return this.serviceRepository.getServicesByStatus(status,type);
  }
}
