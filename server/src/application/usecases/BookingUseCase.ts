import {
  Booking,
  Hall,
  Slot,
} from "../../domain/entities/hallbooking/HallBooking";
import { BookingRepository } from "../interfaces/BookRepository";
import { HallRepository } from "../interfaces/HallRepository";

export class BookingUseCase {
  constructor(
    private bookingRepository: BookingRepository,
    private hallRepository: HallRepository
  ) {}

  async createBooking(booking: Booking, slot: Slot): Promise<Booking> {
    const hall = await this.hallRepository.findById(slot.hallId);
    if (!hall) {
      throw new Error("Hall not found");
    }

    return this.bookingRepository.createBooking(booking, slot);
  }

  async getBooking(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async updateBooking(
    id: string,
    booking: Partial<Booking>
  ): Promise<Booking | null> {
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
    startDate.setDate(startDate.getDate() + 2); // Set start date to 2 days from now

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + forDays);

    const halldata = await this.hallRepository.findById(hallId);

    const allSlots = this.generateAllSlots(
      startDate,
      forDays,
      hallId,
      halldata?.availableSlots,
      halldata?.price
    );
    const bookedSlots = await this.bookingRepository.getAllSlots(hallId);

    return this.updateSlotsWithBookings(allSlots, bookedSlots);
  }

  async getAvailableSlots(forDays: number, hallId: string): Promise<Slot[]> {
    const startDate = new Date();
    const bookeddate = new Date();
    startDate.setDate(startDate.getDate() + 1); // Set start date to 2 days from now

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + forDays);

    const halldata = await this.hallRepository.findById(hallId);

    const allSlots = this.generateAllSlots(
      startDate,
      forDays,
      hallId,
      halldata?.availableSlots,
      halldata?.price
    );
    const bookedSlots = await this.bookingRepository.getAvailableSlots(
      bookeddate,
      endDate,
      hallId
    );
    return this.filterAvailableSlots(allSlots, bookedSlots);
  }

  private generateAllSlots(
    startDate: Date,
    numberOfDays: number,
    hallId: string,
    availableslot: any,
    price: Partial<Hall["price"]> | undefined
  ): Slot[] {
    const slots: Slot[] = [];

    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      if (availableslot.fullDay)
        slots.push(this.createFullDaySlot(currentDate, hallId, price?.fullDay));
      if (availableslot.morning)
        slots.push(
          this.createHalfDaySlot(currentDate, "morning", hallId, price?.morning)
        );
      if (availableslot.evening)
        slots.push(
          this.createHalfDaySlot(currentDate, "evening", hallId, price?.evening)
        );
    }

    return slots;
  }

  private createFullDaySlot(
    date: Date,
    hallId: string,
    price: number | undefined
  ): Slot {
    return {
      id: `full-day-${date.toISOString()}`,
      title: "Full Day",
      start: new Date(date.setHours(9, 0, 0, 0)),
      end: new Date(date.setHours(17, 0, 0, 0)),
      slotType: "Fullday",
      slotPrice: price || 0,
      status: "available",
      hallId: hallId,
    };
  }

  private createHalfDaySlot(
    date: Date,
    period: "morning" | "evening",
    hallId: string,
    price: number | undefined
  ): Slot {
    const isEvening = period === "evening";
    return {
      id: `${period}-${date.toISOString()}`,
      title: isEvening ? "Evening" : "Morning",
      start: new Date(date.setHours(isEvening ? 13 : 9, 0, 0, 0)),
      end: new Date(date.setHours(isEvening ? 17 : 13, 0, 0, 0)),
      slotType: isEvening ? "HD-evening" : "HD-morning",
      slotPrice: price || 0,
      status: "available",
      hallId: hallId,
    };
  }

  private filterAvailableSlots(allSlots: Slot[], bookedSlots: Slot[]): Slot[] {
    const bookedSlotMap = new Map(
      bookedSlots.map((slot) => [this.getSlotKey(slot), slot])
    );

    return allSlots.filter((slot) => {
      const date = slot.start.toISOString().split("T")[0];
      const fulldayKey = `Fullday-${date}`;
      const morningKey = `HD-morning-${date}`;
      const eveningKey = `HD-evening-${date}`;

      const isFulldayBooked = bookedSlotMap.has(fulldayKey);
      const isMorningBooked = bookedSlotMap.has(morningKey);
      const isEveningBooked = bookedSlotMap.has(eveningKey);

      // Remove all slots if both half-day and full-day are booked
      if ((isMorningBooked && isEveningBooked) || isFulldayBooked) {
        return false;
      }

      // Remove half-day morning and full-day when half-day morning is booked
      if (
        isMorningBooked &&
        (slot.slotType === "Fullday" || slot.slotType === "HD-morning")
      ) {
        return false;
      }

      // Remove half-day evening and full-day when half-day evening is booked
      if (
        isEveningBooked &&
        (slot.slotType === "Fullday" || slot.slotType === "HD-evening")
      ) {
        return false;
      }

      return true;
    });
  }

  private getSlotKey(slot: Slot): string {
    return `${slot.slotType}-${slot.start.toISOString().split("T")[0]}`;
  }

  private updateSlotsWithBookings(
    allSlots: Slot[],
    bookedSlots: Slot[]
  ): Slot[] {
    const bookedSlotMap = new Map(
      bookedSlots.map((slot) => [this.getSlotKey(slot), slot])
    );

    return allSlots.map((slot) => {
      const bookedSlot = bookedSlotMap.get(this.getSlotKey(slot));
      return bookedSlot || slot;
    });
  }
}
