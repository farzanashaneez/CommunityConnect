import { Announcement } from "../../domain/entities/announcement/Announcement";
import { AnnouncementRepository } from "../interfaces/AnnouncementRepository";

export class AnnouncementUseCase {
  constructor(private announcementRepository: AnnouncementRepository) {}

  async createAnnouncement(announcementData: Partial<Announcement>): Promise<Announcement> {
    // if (!announcementData.status) {
    //   announcementData.status = 'active';
    // }
    return this.announcementRepository.createAnnouncement(announcementData);
  }

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    return this.announcementRepository.getAnnouncementById(id);
  }

  async updateAnnouncement(id: string, announcementData: Partial<Announcement>): Promise<Announcement> {
    return this.announcementRepository.updateAnnouncement(id, announcementData);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    return this.announcementRepository.deleteAnnouncement(id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementRepository.getAllAnnouncements();
  }

  async getAnnouncementsByStatus(status: 'active' | 'inactive'): Promise<Announcement[]> {
    return this.announcementRepository.getAnnouncementsByStatus(status);
  }
}
