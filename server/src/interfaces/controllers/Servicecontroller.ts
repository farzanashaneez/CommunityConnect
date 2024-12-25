// src/infrastructure/web/controllers/ServiceController.ts

import { NextFunction, Request, Response } from "express";
import { ServiceUseCase } from "../../application/usecases/serviceUseCases";
import { CustomRequest } from "../../infrastructure/middlewares/uploadImageToCloudinary";
import notificationServices from "../../application/services/notificationServices";
import {
  emitNotificationUpdate,
  emitNotificationUpdatetoId,
} from "../../infrastructure/services/socketIOServices";

export class ServiceController {
  constructor(private serviceUseCase: ServiceUseCase) {}

  async createService(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const serviceData = {
        name: req.body.serviceName,
        type: req.body.type || "local",
        price: Number(req.body.price),
        description: req.body.description,
        provider: req.body.provider || "",
        category: req.body.category || "common",
        imageUrl: req.imageUrl || "",
      };
      console.log(serviceData, "===========file", serviceData, req.body);

      const newService = await this.serviceUseCase.createService(serviceData);
      const notificationMessage = `New service created: ${newService.name}`;

      Promise.resolve().then(async () => {
        const notificationMessage = `service granted:Requested ${newService.name} is granted`;
        await notificationServices.createNotification(
          notificationMessage,
          [newService.provider],
          true
        ); // Send to all users
        emitNotificationUpdatetoId(newService.provider, {
          message: notificationMessage,
        }); // Emit update
      });

      res.status(201).json(newService);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error creating service", error: error?.message });
    }
  }

  async getServiceById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const service = await this.serviceUseCase.getServiceById(id);
      if (service) {
        res.json(service);
      } else {
        res.status(404).json({ message: "Service not found" });
      }
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error fetching service", error: error?.message });
    }
  }

  async updateService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const updatedService = await this.serviceUseCase.updateService(
        id,
        serviceData
      );
      res.json(updatedService);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error updating service", error: error?.message });
    }
  }

  async grantService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, action } = req.params;
      console.log("id==>", id);
      let updatedService: any;
      if (action === "grantservice") {
        updatedService = await this.serviceUseCase.grantservice(id, "granted");
      } else if (action === "rejectservice") {
        updatedService = await this.serviceUseCase.grantservice(id, "rejected");
      }

      if (updatedService.status === "granted") {
        Promise.resolve().then(async () => {
          const notificationMessage = `New service created: ${updatedService.name}`;
          await notificationServices.createNotification(
            notificationMessage,
            [],
            true
          ); // Send to all users
          emitNotificationUpdate({ message: notificationMessage }); // Emit update
        });
      }
      res.json(updatedService);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error updating service", error: error?.message });
    }
  }
  async markservicecompleted(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const serviceData = req.body;
      const updatedService = await this.serviceUseCase.markservicecompleted(
        id,
        serviceData
      );
      res.json(updatedService);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error updating service", error: error?.message });
    }
  }
  async requestLocalService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.body;
      const serviceId = req.params.id;
      console.log("service id, userid",serviceId,userId,req.body)
      const reqService = await this.serviceUseCase.requestLocalService(
        serviceId,
        userId
      );
      res.json(reqService);
    } catch (err: any) {
      res
        .status(400)
        .json({ message: "Error requesting a service", error: err?.message });
    }
  }
async getAllServiceRequst( 
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.params.status;
    console.log("status===>", status);

    const requestedServices = await this.serviceUseCase.getAllRequestedServices(status);
    res.json(requestedServices);
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Error fetching services", error: error?.message });
  }
}

  async deleteService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.serviceUseCase.deleteService(id);
      res.status(204).send();
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error deleting service", error: error?.message });
    }
  }

  async getAllServices(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const type = req.params.type;
      console.log("type===>", type);
      const services = await this.serviceUseCase.getAllServices(type);
      res.json(services);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error fetching services", error: error?.message });
    }
  }
  async getServicesByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, type } = req.params;
      console.log("status===>", status);
      const services = await this.serviceUseCase.getServicesByStatus(
        status,
        type
      );
      res.json(services);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error fetching services", error: error?.message });
    }
  }
}
