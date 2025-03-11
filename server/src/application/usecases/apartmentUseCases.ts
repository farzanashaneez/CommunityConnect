
import { Apartment } from '../../domain/entities/apartments/Apartment';
import { ApartmentRepository } from '../interfaces/ApartmentRepository';

export class ApartmentUseCases {
  constructor(private apartmentRepository: ApartmentRepository) {}

  async createApartment(apartmentData: Apartment): Promise<Apartment> {
    return this.apartmentRepository.create(apartmentData);
  }

  async getAllApartments(): Promise<Apartment[]> {
    return this.apartmentRepository.findAll();
  }
}