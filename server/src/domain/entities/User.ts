

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    password: string;
    apartmentId: any;
    isAdmin:boolean;
    imageUrl:string;
    members: Array<{
      name: string;
      relation: string;
      provision: string;
    }>;
  }