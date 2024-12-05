// src/infrastructure/web/controllers/ServiceController.ts

import { Request, Response } from 'express';
import { ServiceUseCase } from '../../application/usecases/serviceUseCases';

export class ServiceController {
  constructor(private serviceUseCase: ServiceUseCase) {}

  async createService(req: Request, res: Response): Promise<void> {
    try {
      const serviceData = req.body;
      const newService = await this.serviceUseCase.createService(serviceData);
      res.status(201).json(newService);
    } catch (error:any) {
      res.status(400).json({ message: 'Error creating service', error: error?.message });
    }
  }

  async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const service = await this.serviceUseCase.getServiceById(id);
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ message: 'Service not found' });
      }
    } catch (error:any) {
      res.status(400).json({ message: 'Error fetching service', error: error?.message });
    }
  }

  async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const updatedService = await this.serviceUseCase.updateService(id, serviceData);
      res.json(updatedService);
    } catch (error:any) {
      res.status(400).json({ message: 'Error updating service', error: error?.message });
    }
  }

  async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.serviceUseCase.deleteService(id);
      res.status(204).send();
    } catch (error:any) {
      res.status(400).json({ message: 'Error deleting service', error: error?.message });
    }
  }

  async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const services = await this.serviceUseCase.getAllServices();
      res.json(services);
    } catch (error:any) {
      res.status(400).json({ message: 'Error fetching services', error: error?.message });
    }
  }
}