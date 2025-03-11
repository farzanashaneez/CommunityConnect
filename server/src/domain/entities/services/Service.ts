export interface Service {
    id?: string;
    _id:string;
    name: string;
    type: 'local' | 'residential';
    price: number;
    provider: any;
    description: string;
    category: string;
    imageUrl: string;
    status: 'granted' | 'pending';
    createdAt: Date; 
  }

  export interface ServiceRequest{
    id?:string;
    requestId:any;
    serviceId:any;
    requestedDate?:Date;
    status?:string;
    createdAt?:Date;
  }