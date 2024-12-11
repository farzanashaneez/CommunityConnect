// src/infrastructure/web/controllers/ServiceController.ts

import { NextFunction, Request, Response } from 'express';
import { ServiceUseCase } from '../../application/usecases/serviceUseCases';
import { CustomRequest } from '../../infrastructure/middlewares/uploadImageToCloudinary';

export class ServiceController {
  constructor(private serviceUseCase: ServiceUseCase) {}

  async createService(req: CustomRequest, res: Response,next:NextFunction): Promise<void> {
    try {
     

     const serviceData = {
      name:req.body.serviceName,
      type:req.body.type || 'local',
      price: Number(req.body.price),
      description:req.body.description,
      provider:req.body.provider || '' ,
      category:req.body.category||'common',
      imageUrl: req.imageUrl || '',
    };
      console.log(serviceData,"===========file",serviceData,req.body)

      const newService = await this.serviceUseCase.createService(serviceData);
      res.status(201).json(newService);
    } catch (error:any) {
      res.status(400).json({ message: 'Error creating service', error: error?.message });
    }
  }

  async getServiceById(req: Request, res: Response,next:NextFunction): Promise<void> {
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

  async updateService(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const updatedService = await this.serviceUseCase.updateService(id, serviceData);
      res.json(updatedService);
    } catch (error:any) {
      res.status(400).json({ message: 'Error updating service', error: error?.message });
    }
  }

  async deleteService(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.serviceUseCase.deleteService(id);
      res.status(204).send();
    } catch (error:any) {
      res.status(400).json({ message: 'Error deleting service', error: error?.message });
    }
  }

  async getAllServices(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      const type=req.params.type;
      console.log("type===>",type)
      const services = await this.serviceUseCase.getAllServices(type);
      res.json(services);
    } catch (error:any) {
      res.status(400).json({ message: 'Error fetching services', error: error?.message });
    }
  }
}