import { MongoNotificationRepository } from "../../infrastructure/database/MongoNotificationRepository";
import { Notification } from "../../domain/entities/notifications/Notification";

class NotificationService {
  private notificationRepository = new MongoNotificationRepository();

  async createNotification(message: string, userIds?: string[], broadcast?: boolean): Promise<Notification> {
    const notificationData = { message, userIds, broadcast };
    return this.notificationRepository.createNotification(notificationData);
  }

}

export default new NotificationService();
