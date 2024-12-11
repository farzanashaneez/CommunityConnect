export interface Announcement {
    _id: string; // Unique identifier
    title: string; // Title of the announcement
    description: string; // Details of the announcement
    status: 'active' | 'inactive'; // Status of the announcement
    createdAt: Date; // Timestamp of creation
    updatedAt: Date; // Timestamp of the last update
  }
  