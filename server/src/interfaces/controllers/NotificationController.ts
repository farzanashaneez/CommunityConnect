// src/infrastructure/controllers/NotificationController.ts
import { NextFunction, Request, Response } from 'express';
import { NotificationUseCase } from '../../application/usecases/NotificationUseCase';
import { emitNotificationUpdate } from '../../infrastructure/services/socketIOServices';

export class NotificationController {
  constructor(private notificationUseCase: NotificationUseCase) {}

  async createNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notificationData = req.body;
      const newNotification = await this.notificationUseCase.createNotification(notificationData);
      emitNotificationUpdate(newNotification);
      res.status(201).json(newNotification);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating notification', error: error?.message });
    }
  }

  async getNotificationById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await this.notificationUseCase.getNotificationById(id);
      if (notification) {
        res.json(notification);
      } else {
        res.status(404).json({ message: 'Notification not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching notification', error: error?.message });
    }
  }

  async updateNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const notificationData = req.body;
      const updatedNotification = await this.notificationUseCase.updateNotification(id, notificationData);
      res.json(updatedNotification);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating notification', error: error?.message });
    }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.notificationUseCase.deleteNotification(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: 'Error deleting notification', error: error?.message });
    }
  }

  async getAllNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await this.notificationUseCase.getAllNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching notifications', error: error?.message });
    }
  }

  async getNotificationsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this.notificationUseCase.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching notifications', error: error?.message });
    }
  }
}
