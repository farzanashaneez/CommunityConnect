import { Booking, Slot } from "../../domain/entities/HallBooking";

export interface BookingRepository {
    createBooking(booking: Booking,slot:Slot): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    update(id: string, booking: Partial<Booking>): Promise<Booking | null>;
    updateSlot(id: string, slot: Partial<Slot>): Promise<Slot | null>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<Booking[]>;
    findByUserId(userId: string): Promise<Booking[]>;
    // isSlotAvailable(hallId: string, date: Date, slot: 'morning' | 'evening' | 'fullDay'): Promise<boolean>;
    getAvailableSlots(startDate: Date, endDate: Date,hallid:string):Promise<Slot[]>
    getAllSlots(hallid:string):Promise<Slot[]>

}