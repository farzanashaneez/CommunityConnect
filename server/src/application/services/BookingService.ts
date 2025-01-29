import { Booking, Slot } from "../../domain/entities/HallBooking";
import { MongoBookingRepository } from "../../infrastructure/database/MongoBookingRepository";

class BookingService {
  private bookingREpo = new MongoBookingRepository();

  async createBooking(bookindData:Booking,slotData:Slot){
    return this.bookingREpo.createBooking(bookindData,slotData);
  }
  async updateBooking(id:string,bookingdata:Partial<Booking>){
    return this.bookingREpo.update(id,bookingdata)
  }
  async findExpiredPendingBookings(){
return this.bookingREpo.findByExpired()
  }
  async deleteExpiredSlot(id:string){
    return this.bookingREpo.deleteSlot(id)
  }
}

export default new BookingService();