// src/infrastructure/database/MongoNotificationRepository.ts
import mongoose, { Schema, Document } from "mongoose";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../application/interfaces/NotificationRepository";

const notificationSchema = new Schema<Notification>({
    userIds: { type: [String], required: true },
    message: { type: String, required: true },
    seenBy: { type: [String], default: [] },
    broadcast: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date,default:new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) }, 

  });
  notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

const NotificationModel = mongoose.model<Notification>("Notification", notificationSchema);

export class MongoNotificationRepository implements NotificationRepository {
  async createNotification(notification: Partial<Notification>): Promise<Notification> {
    const newNotification = new NotificationModel(notification);
    return newNotification.save();
  }

  async getNotificationByFilter(id: string): Promise<Notification[] | null> {
    return NotificationModel.find({
      $or: [
        { userIds: id }, 
        { broadcast: true } 
      ]
    }).sort({createdAt:-1}).exec();
  }

  async updateNotification(id: string, notificationData: Partial<Notification>): Promise<Notification> {
    const {seenBy}=notificationData;
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      { $addToSet: { seenBy: seenBy } }, 
      { new: true } 
    ).exec();
        if (!updatedNotification) {
      throw new Error('Notification not found');
    }
    return updatedNotification;
  }

  async deleteNotification(id: string): Promise<void> {
    const result = await NotificationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Notification not found');
    }
  }

  async getAllNotifications(): Promise<Notification[]> {
    return NotificationModel.find().exec();
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return NotificationModel.find({ userIds: userId }).exec();
  }
}
