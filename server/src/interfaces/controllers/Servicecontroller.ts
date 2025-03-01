// src/infrastructure/web/controllers/ServiceController.ts

import { NextFunction, Request, Response } from "express";
import { ServiceUseCase } from "../../application/usecases/serviceUseCases";
import { CustomRequest } from "../../infrastructure/middlewares/uploadImageToCloudinary";
import notificationServices from "../../application/services/notificationServices";
// import {
//   emitNotificationUpdate,
//   emitNotificationUpdatetoId,
// } from "../../infrastructure/services/socketIOServices";
import { getIO } from "../../infrastructure/services/socket";
import {
  sendMulticastNotification,
  sendNotification,
} from "../../infrastructure/services/fcm";
import UserService from "../../application/services/UserService";

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

      const newService = await this.serviceUseCase.createService(serviceData);
      const notificationMessage = `New service created: ${newService.name}`;

      Promise.resolve().then(async () => {
        const notificationMessage = `service granted:Requested ${newService.name} is granted`;
        await notificationServices.createNotification(
          notificationMessage,
          [newService.provider],
          true
        );
        const io = getIO();
        io.to(newService.provider).emit("notificationUpdate", {
          message: notificationMessage,
        }); // Notify all clients about the new/updated notification
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
            [id],
            false
          ); // Send to all users
          const io = getIO();
          io.emit("notificationUpdate", { message: notificationMessage }); // Notify all clients about the new/updated notification
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
      const newreqService = await this.serviceUseCase.requestLocalService(
        serviceId,
        userId
      );

      const tokensFCM = await UserService.getFCMTokensOfSecurities();

      if (tokensFCM) {
        await sendMulticastNotification(
          tokensFCM,
          "Service Request..!",
          "You have new Service Request"
        );
      }
      res.json(newreqService);
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

      const requestedServices =
        await this.serviceUseCase.getAllRequestedServices(status);
      // await sendNotification('cn2LXkcEISeuc-VTx_4bQL:APA91bEiNe3xCFMqFj-SRPjsuowYuh26K6cJOjAEXopXwHyITYDXahkruPnaAZzcdqrB213998bRI3gtuyD4cjDe-1XoRq1TkPzsLapkTsFk0qwjDaZVxXc','title','checking notification is working')

      res.json(requestedServices);
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Error fetching services", error: error?.message });
    }
  }

  async getAllServicesOfUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;

      const requestedServices = await this.serviceUseCase.getAllServicesOfUser(
        userId
      );

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
  async contactserviceProvider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { serviceData, provider, requestby, shareMessage } = req.body;

      const chat = await this.serviceUseCase.contactServiceProvider(
        serviceData,
        provider,
        requestby,
        shareMessage
      );
      res.json(chat);
    } catch (err: any) {
      res
        .status(400)
        .json({
          message: "error contacting service provider",
          error: err?.message,
        });
    }
  }
}
