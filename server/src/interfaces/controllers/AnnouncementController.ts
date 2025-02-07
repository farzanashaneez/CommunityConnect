import { NextFunction, Request, Response } from "express";
import { AnnouncementUseCase } from "../../application/usecases/announcementUseCase";
import { CustomRequest } from "../../infrastructure/middlewares/uploadImageToCloudinary";
import notificationServices from "../../application/services/notificationServices";
import { getIO } from "../../infrastructure/services/socket";
import {
  sendMulticastNotification,
  sendNotification,
} from "../../infrastructure/services/fcm";
import UserService from "../../application/services/UserService";

export class AnnouncementController {
  constructor(private announcementUseCase: AnnouncementUseCase) {}

  async createAnnouncement(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("in announcement controller");
    try {
      const announcementData = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date || new Date(),
        announcementtype: req.body.announcementtype,
        imageUrl: req.imageUrl || "",
      };

      const newAnnouncement = await this.announcementUseCase.createAnnouncement(
        announcementData
      );
      const tokensFCM = await UserService.getFCMTokens();
      if (tokensFCM) {
        await sendMulticastNotification(
          tokensFCM,
          newAnnouncement.title,
          `${newAnnouncement.announcementtype} :${newAnnouncement.description}`
        );
      }
      Promise.resolve().then(async () => {
        const notificationMessage = `New Announcement : ${announcementData.title} is added`;
        await notificationServices.createNotification(
          notificationMessage,
          [],
          true
        );
        const io = getIO();
        io.emit("notificationUpdate", {
          message: notificationMessage,
        });
      });
      res.status(201).json(newAnnouncement);
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: "Error creating announcement",
          error: error?.message,
        });
    }
  }

  async getAnnouncementById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const announcement = await this.announcementUseCase.getAnnouncementById(
        id
      );
      if (announcement) {
        res.json(announcement);
      } else {
        res.status(404).json({ message: "Announcement not found" });
      }
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: "Error fetching announcement",
          error: error?.message,
        });
    }
  }

  async updateAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const announcementData = req.body;
      const updatedAnnouncement =
        await this.announcementUseCase.updateAnnouncement(id, announcementData);
      res.json(updatedAnnouncement);
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: "Error updating announcement",
          error: error?.message,
        });
    }
  }

  async deleteAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.announcementUseCase.deleteAnnouncement(id);
      res.status(204).send();
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: "Error deleting announcement",
          error: error?.message,
        });
    }
  }

  async getAllAnnouncements(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const announcements =
        await this.announcementUseCase.getAllAnnouncements();

      res.json(announcements);
    } catch (error: any) {
      res
        .status(400)
        .json({
          message: "Error fetching announcements",
          error: error?.message,
        });
    }
  }
}
