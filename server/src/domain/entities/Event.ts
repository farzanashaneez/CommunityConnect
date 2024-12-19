export interface Event {
    _id: string; 
    name: string;
    description: string; 
    date: Date; 
    location: {lat:number;lng:number}; 
    imageUrl:string
    status: 'scheduled'|'ongoing' | 'completed'; 
    createdAt: Date; 
    updatedAt: Date; 
  }
  