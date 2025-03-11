import { Hall } from "../../domain/entities/hallbooking/HallBooking";

export interface HallRepository {
  create(hall: Hall): Promise<Hall>;
  findById(id: string): Promise<Hall | null>;
  update(id: string, hall: Partial<Hall>): Promise<Hall | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Hall[]>;
  findAvailable(
    date: Date,
    slot: "morning" | "evening" | "fullDay"
  ): Promise<Hall[]>;
}
