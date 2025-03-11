export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    provider:any
  }
  
 export  interface ServiceListProps {
    type: 'local' | 'residential';
    status?:string;
    update?:number;
    isAdmin:boolean;
    newService?:Service | null;

  }
  
  export interface Event {
    _id: string;
    name: string;
    description: string;
    date: string;
    imageUrl: string;
    status: string;
    location: { lat: number; lng: number };
  }
  
 export  interface EventListProps {
    isAdmin:boolean;
    newEvent?:Event | null;
  }

  export interface Announcement {
  
      _id: string;
      title: string;
      description: string;
      date: string;
      imageUrl?: string;
      announcementtype: string;
    
  }
  
 export  interface AnnouncementListProps {
    isAdmin:boolean;
    newAnnouncement?:Announcement|null;
  }