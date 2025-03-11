
export interface Notification {
    userIds: string[]; 
    message: string; 
    seenBy: string[];
    broadcast: boolean;
    createdAt?: Date; 
    expiresAt?:Date;
  }