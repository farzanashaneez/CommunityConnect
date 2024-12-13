export interface Event {
    _id: string; 
    name: string;
    description: string; 
    date: Date; 
    location: string; 
    imageUrl:string
    status: 'scheduled'|'ongoing' | 'completed'; 
    createdAt: Date; 
    updatedAt: Date; 
  }
  