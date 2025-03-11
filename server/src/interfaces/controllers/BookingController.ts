import { NextFunction, Request, Response } from 'express';
// import { getIO } from '../../infrastructure/services/socket';
// import notificationServices from '../../application/services/notificationServices';
import { BookingUseCase } from '../../application/usecases/BookingUseCase';

export class BookingController {
  constructor(private bookingUseCase: BookingUseCase) {}

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {bookingData,slotData} = req.body;
      const newBooking = await this.bookingUseCase.createBooking(bookingData,slotData);
      res.status(201).json(newBooking);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating booking', error: error?.message });
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await this.bookingUseCase.getBooking(id);
      if (booking) {
        res.json(booking);
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching booking', error: error?.message });
    }
  }

  async updateBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const bookingData = req.body;
      const updatedBooking = await this.bookingUseCase.updateBooking(id, bookingData);
      res.json(updatedBooking);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating booking', error: error?.message });
    }
  }

  async deleteBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.bookingUseCase.deleteBooking(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: 'Error deleting booking', error: error?.message });
    }
  }

  async getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await this.bookingUseCase.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching bookings', error: error?.message });
    }
  }

  async getUserBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const bookings = await this.bookingUseCase.getUserBookings(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching user bookings', error: error?.message });
    }
  }
  async getAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void>{
    try{
      const {fordays,hallid}=req.params;
      const slots=await this.bookingUseCase.getAvailableSlots(parseInt(fordays),hallid)
      res.json(slots)
    }
    catch(err:any){
res.status(400).json({message:'Error getting available slots',error:err.message});
    }
  }

  async getAllSlotsOfHall(req: Request, res: Response, next: NextFunction): Promise<void>{
    try{
      
      const {fordays,hallid}=req.params;
      const slots=await this.bookingUseCase.getAllSlotsOfHall(parseInt(fordays),hallid)
      res.json(slots)
    }
    catch(err:any){
res.status(400).json({message:'Error getting available slots',error:err.message});
    }
  }
  async updateSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slotid } = req.params;
      const slotData = req.body;
      const updateSlot = await this.bookingUseCase.updateSlot(slotid, slotData);
      res.json(updateSlot);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating booking', error: error?.message });
    }
  }
  
}