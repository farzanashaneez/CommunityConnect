import mongoose, { Model, Schema } from "mongoose";
import { Announcement } from "../../domain/entities/Announcement";
import { AnnouncementRepository } from "../../application/interfaces/AnnouncementRepository";

const announcementSchema = new Schema<Announcement>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  announcementtype:{ type: String,enum:["general","urgent"],default:"general"},
  date: { type: Date, default: Date.now },
  imageUrl:{ type:String}
});


const AnnouncementModel = mongoose.model<Announcement>("Announcement", announcementSchema);

export class MongoAnnouncementRepository implements AnnouncementRepository {
  async createAnnouncement(announcement: Partial<Announcement>): Promise<Announcement> {
    const newAnnouncement = new AnnouncementModel(announcement);
    return newAnnouncement.save();
  }

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    return AnnouncementModel.findById(id).exec();
  }

  async updateAnnouncement(id: string, announcementData: Partial<Announcement>): Promise<Announcement> {
    const updatedAnnouncement = await AnnouncementModel.findByIdAndUpdate(id, announcementData, { new: true }).exec();
    if (!updatedAnnouncement) {
      throw new Error('Announcement not found');
    }
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: string): Promise<void> {
    const result = await AnnouncementModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Announcement not found');
    }
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return AnnouncementModel.find().exec();
  }

  async getAnnouncementsByStatus(status: 'active' | 'inactive'): Promise<Announcement[]> {
    return AnnouncementModel.find({ status }).exec();
  }
}
