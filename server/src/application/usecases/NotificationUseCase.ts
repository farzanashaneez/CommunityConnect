import { NotificationRepository } from "../interfaces/NotificationRepository";
import { Notification } from "../../domain/entities/notifications/Notification";

export class NotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    return this.notificationRepository.createNotification(notificationData);
  }

  async getNotificationByFilter(id: string): Promise<Notification[] | null> {
    return this.notificationRepository.getNotificationByFilter(id);
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
