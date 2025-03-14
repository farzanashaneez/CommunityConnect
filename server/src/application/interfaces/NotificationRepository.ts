// src/application/interfaces/NotificationRepository.ts
import { Notification } from "../../domain/entities/notifications/Notification";

export interface NotificationRepository {
  createNotification(notification: Partial<Notification>): Promise<Notification>;
  getNotificationByFilter(id: string): Promise<Notification[] | null>;
  updateNotification(id: string, notificationData: Partial<Notification>): Promise<Notification>;
  deleteNotification(id: string): Promise<void>;
  getAllNotifications(): Promise<Notification[]>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
}
