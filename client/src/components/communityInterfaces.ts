export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }
  
 export  interface ServiceListProps {
    type: 'local' | 'residential';
    searchTerm: string;
    status?:string;
    update?:number;
    isAdmin:boolean;
  }
  
  export interface Event {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
  }
  
 export  interface EventListProps {
    searchTerm?: string;
    update?:number;
    isAdmin:boolean;
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
    searchTerm?: string;
    update?:number;
    isAdmin:boolean;
  }