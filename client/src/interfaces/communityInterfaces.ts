export interface Service{
    _id?: string;
    name: string;
    type: 'local' | 'residential';
    price: number;
    provider?:{apartmentId:{buildingSection:string,apartmentNumber:string}};
    description: string;
    category: string;
    imageUrl: string;
    status: 'granted' | 'pending';
    createdAt: Date; 
}
export interface ServiceRequest{
    _id?:string;
    requestId:any;
    serviceId:any;
    requestedDate:Date;
    status:string
  }