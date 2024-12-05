import { Service } from "../../domain/entities/Service";

export interface ServiceRepository {
  createService(service: Partial<Service>): Promise<Service>;
  getServiceById(id: string): Promise<Service | null>;
  updateService(id: string, serviceData: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  getAllServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  getServicesByType(type: 'local' | 'residential'): Promise<Service[]>;
  getServicesByStatus(status: 'granted' | 'pending'): Promise<Service[]>;
}