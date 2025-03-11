export interface Announcement {
    _id: string; 
    title: string; 
    description: string; 
    announcementtype: 'general' | 'urgent'; 
    date:Date;
    imageUrl:string;
    createdAt: Date; 
    updatedAt: Date;
  }
  