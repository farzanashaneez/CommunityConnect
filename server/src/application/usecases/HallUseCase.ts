// use-cases/HallUseCase.ts

import { Hall } from "../../domain/entities/hallbooking/HallBooking";
import { HallRepository } from "../interfaces/HallRepository";

export class HallUseCase {
  constructor(private hallRepository: HallRepository) {}

  async createHall(hall: Hall): Promise<Hall> {
    return this.hallRepository.create(hall);
  }

  async getHall(id: string): Promise<Hall | null> {
    return this.hallRepository.findById(id);
  }

  async updateHall(id: string, hall: Partial<Hall>): Promise<Hall | null> {
    return this.hallRepository.update(id, hall);
  }

  async deleteHall(id: string): Promise<boolean> {
    return this.hallRepository.delete(id);
  }

  async getAllHalls(): Promise<Hall[]> {
    return this.hallRepository.findAll();
  }

  async getAvailableHalls(
    date: Date,
    slot: "morning" | "evening" | "fullDay"
  ): Promise<Hall[]> {
    return this.hallRepository.findAvailable(date, slot);
  }
}
