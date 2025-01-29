export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  apartmentId: any;
  isAdmin: boolean;
  isSecurity:boolean;
  imageUrl: string;
  members: Array<{
    name: string;
    relation: string;
    provision: string;
  }>;
  fcmTokens?: Array<{ token: string; deviceInfo: string; lastUsed: Date }>;
  createdAt: Date;
  role?: string;
}
