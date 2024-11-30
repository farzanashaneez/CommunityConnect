import { Apartment } from '../../domain/entities/Apartment';

export interface ApartmentRepository {
  create(apartment: Apartment): Promise<Apartment>;
  findAll(): Promise<Apartment[]>;
}