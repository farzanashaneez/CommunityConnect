export interface Announcement {
    _id: string; // Unique identifier
    title: string; // Title of the announcement
    description: string; // Details of the announcement
    announcementtype: 'general' | 'urgent'; 
    date:Date;
    imageUrl:string;
    createdAt: Date; 
    updatedAt: Date;
  }
  