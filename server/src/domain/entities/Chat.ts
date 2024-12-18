
export interface Message {
    _id: string;
    senderId: string;
    content: string;
    status: "sending" | "sent" | "delivered" | "read";
    createdAt: Date;
  }
  
  export interface Chat {
    _id: string;
    participants: string[];
    isgroup:boolean;
    groupName:string;
    createdBy:string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
  }
  