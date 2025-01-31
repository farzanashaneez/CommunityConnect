import { Booking, Hall, Slot } from "../../domain/entities/HallBooking";
import { BookingRepository } from "../interfaces/BookRepository";
import { HallRepository } from "../interfaces/HallRepository";

export class BookingUseCase {
    constructor(
        private bookingRepository: BookingRepository,
        private hallRepository: HallRepository
    ) {}

    async createBooking(booking: Booking,slot:Slot): Promise<Booking> {
     
        const hall = await this.hallRepository.findById(slot.hallId);
        if (!hall) {
            throw new Error('Hall not found');
        }

        // const isSlotAvailable = await this.bookingRepository.isSlotAvailable(
        //     booking.hallId,
        //     booking.selectedDate,
        //     booking.selectedSlot
        // );

        // if (!isSlotAvailable) {
        //     throw new Error('Selected slot is not available');
        // }

        // booking.totalPrice = this.calculateTotalPrice(hall, booking);
        // booking.status = 'pending';

        return this.bookingRepository.createBooking(booking,slot);
    }

    async getBooking(id: string): Promise<Booking | null> {
        return this.bookingRepository.findById(id);
    }

    async updateBooking(id: string, booking: Partial<Booking>): Promise<Booking | null> {
        return this.bookingRepository.update(id, booking);
    }

    async deleteBooking(id: string): Promise<boolean> {
        return this.bookingRepository.delete(id);
    }

    async getAllBookings(): Promise<Booking[]> {
        return this.bookingRepository.findAll();
    }

    async getUserBookings(userId: string): Promise<Booking[]> {
        return this.bookingRepository.findByUserId(userId);
    }
    async updateSlot(id: string, slot: Partial<Slot>): Promise<Slot | null> {
      return this.bookingRepository.updateSlot(id, slot);
  }
    async getAllSlotsOfHall(forDays: number, hallId: string): Promise<Slot[]> {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Set start date to 2 days from now
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + forDays);
    
      const halldata=await this.hallRepository.findById(hallId)
      // console.log("halldata   ",halldata)

      const allSlots = this.generateAllSlots(startDate, forDays, hallId,halldata?.availableSlots,halldata?.price);
      const bookedSlots = await this.bookingRepository.getAllSlots(hallId);
    console.log('bookedSlots',bookedSlots)
    return this.updateSlotsWithBookings(allSlots, bookedSlots);
  }

    async getAvailableSlots(forDays: number, hallId: string): Promise<Slot[]> {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Set start date to 2 days from now
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + forDays);
      
    
      const halldata=await this.hallRepository.findById(hallId)
      // console.log("halldata   ",halldata)

      const allSlots = this.generateAllSlots(startDate, forDays, hallId,halldata?.availableSlots,halldata?.price);
      const bookedSlots = await this.bookingRepository.getAvailableSlots(startDate, endDate,hallId);
    console.log('bookedSlots',bookedSlots)
      return this.filterAvailableSlots(allSlots, bookedSlots,halldata?.availableSlots);
    }
    
    private generateAllSlots(startDate: Date, numberOfDays: number, hallId: string,availableslot:any,price:Partial<Hall['price']>|undefined): Slot[] {
      const slots: Slot[] = [];
    
      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
    
       if(availableslot.fullDay) slots.push(this.createFullDaySlot(currentDate, hallId,price?.fullDay));
       if(availableslot.morning) slots.push(this.createHalfDaySlot(currentDate, 'morning', hallId,price?.morning));
       if(availableslot.evening) slots.push(this.createHalfDaySlot(currentDate, 'evening', hallId,price?.evening));
      }
    
      return slots;
    }
    
    private createFullDaySlot(date: Date, hallId: string,price:number|undefined): Slot {
      return {
        id: `full-day-${date.toISOString()}`,
        title: 'Full Day',
        start: new Date(date.setHours(9, 0, 0, 0)),
        end: new Date(date.setHours(17, 0, 0, 0)),
        slotType: 'Fullday',
        slotPrice:price||0,
        status: 'available',
        hallId: hallId
      };
    }
    
    private createHalfDaySlot(date: Date, period: 'morning' | 'evening', hallId: string,price:number|undefined): Slot {
      const isEvening = period === 'evening';
      return {
        id: `${period}-${date.toISOString()}`,
        title: isEvening ? 'Evening' : 'Morning',
        start: new Date(date.setHours(isEvening ? 13 : 9, 0, 0, 0)),
        end: new Date(date.setHours(isEvening ? 17 : 13, 0, 0, 0)),
        slotType: isEvening ? 'HD-evening' : 'HD-morning',
        slotPrice:price||0,
        status: 'available',
        hallId: hallId
      };
    }
    
    private filterAvailableSlots(allSlots: Slot[], bookedSlots: Slot[],availableslot:any): Slot[] {
      const bookedSlotMap = new Map(bookedSlots.map(slot => [this.getSlotKey(slot), slot]));
    
      return allSlots.filter(slot => {
        const bookedSlot = bookedSlotMap.get(this.getSlotKey(slot));
        if (!bookedSlot) return true;
    
        if (slot.slotType === 'Fullday') {
          return false; // Remove full-day slot if there's any booking
        }
    
        if (bookedSlot.slotType === 'Fullday') {
          return false; // Remove half-day slot if there's a full-day booking
        }
    
        return slot.slotType !== bookedSlot.slotType; // Keep the slot if it's not the same type as the booked slot
      });
    }
    
    private getSlotKey(slot: Slot): string {
      return `${slot.slotType}-${slot.start.toISOString().split('T')[0]}`;
    }
    
    private updateSlotsWithBookings(allSlots: Slot[], bookedSlots: Slot[]): Slot[] {
      const bookedSlotMap = new Map(bookedSlots.map(slot => [this.getSlotKey(slot), slot]));

      return allSlots.map(slot => {
        const bookedSlot = bookedSlotMap.get(this.getSlotKey(slot));
        return bookedSlot || slot;
      });
    }
}