import { MongoNotificationRepository } from "../../infrastructure/database/MongoNotificationRepository";
import { Notification } from "../../domain/entities/Notification";

class NotificationService {
  private notificationRepository = new MongoNotificationRepository();

  async createNotification(message: string, userIds?: string[], broadcast?: boolean): Promise<Notification> {
    const notificationData = { message, userIds, broadcast };
    return this.notificationRepository.createNotification(notificationData);
  }

  // Other methods for fetching and managing notifications...
}

export default new NotificationService();
