import { Apartment } from '../../domain/entities/apartments/Apartment';

export interface ApartmentRepository {
  create(apartment: Apartment): Promise<Apartment>;
  findAll(): Promise<Apartment[]>;
}