import { Booking, Slot } from "../../domain/entities/hallbooking/HallBooking";
import { MongoBookingRepository } from "../../infrastructure/database/MongoBookingRepository";

class BookingService {
  private bookingRepo = new MongoBookingRepository();

  async createBooking(bookindData: Booking, slotData: Slot) {
    return this.bookingRepo.createBooking(bookindData, slotData);
  }
  async updateBooking(id: string, bookingdata: Partial<Booking>) {
    return this.bookingRepo.update(id, bookingdata);
  }
  async getBookingById(id:string){
    return this.bookingRepo.findById(id)
  }
  async findExpiredPendingBookings() {
    return this.bookingRepo.findByExpired();
  }
  async deleteExpiredSlot(id: string) {
    return this.bookingRepo.deleteSlot(id);
  }
}

export default new BookingService();
