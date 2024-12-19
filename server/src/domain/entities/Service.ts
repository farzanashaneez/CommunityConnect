export interface Service {
    id?: string;
    name: string;
    type: 'local' | 'residential';
    price: number;
    provider: string;
    description: string;
    category: string;
    imageUrl: string;
    status: 'granted' | 'pending';
    createdAt: Date; 
  }