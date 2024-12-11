export interface Event {
    _id: string; // Unique identifier
    name: string; // Name of the event
    description: string; // Details about the event
    date: Date; // Date and time of the event
    location: string; // Venue or location of the event
    status: 'scheduled' | 'completed'; // Current status of the event
    createdAt: Date; // Timestamp of creation
    updatedAt: Date; // Timestamp of the last update
  }
  