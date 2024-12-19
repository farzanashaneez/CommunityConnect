// src/application/usecases/notificationUseCase.ts
import { NotificationRepository } from "../interfaces/NotificationRepository";
import { Notification } from "../../domain/entities/Notification";

export class NotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    return this.notificationRepository.createNotification(notificationData);
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return this.notificationRepository.getNotificationById(id);
  }

  async updateNotification(id: string, notificationData: Partial<Notification>): Promise<Notification> {
    return this.notificationRepository.updateNotification(id, notificationData);
  }

  async deleteNotification(id: string): Promise<void> {
    return this.notificationRepository.deleteNotification(id);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.getAllNotifications();
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notificationRepository.getNotificationsByUserId(userId);
  }
}
