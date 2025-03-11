// entities/Hall.ts
export interface Hall {
    _id?: string;
    name: string;
    details:string;
    capacity: number;
    isCateringAvailable: boolean;
    price: {
        morning: number;
        evening: number;
        fullDay: number;
        withService: number;
    };
    availableSlots: {
        morning: boolean;
        evening: boolean;
        fullDay: boolean;
    };
    images:string[];
    createdAt:Date;
}
export interface Slot {
    _id?:string;
    id: string;
    title: string;
    start: Date;
    end: Date;
    slotType: 'HD-morning' | 'HD-evening' | 'Fullday';
    slotPrice:number;
    status:'available'| 'booked'|'cancelled'|'notavailable';
    hallId: any;
  }
// entities/Booking.ts
export interface Booking {
    _id?: string;
    hallId: string;
    userId: any;
    otherServiceAdded: boolean;
    selectedSlot:any;
    selectedDate: Date;
    purpose:string;
    stripeSessionId:string;
    status: 'pending' | 'confirmed' | 'cancelled';
    totalPrice: number;
    paid:number;
    createdAt:Date;
}